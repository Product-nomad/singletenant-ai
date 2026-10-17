// Newsletter Worker request handling (workers/newsletter/src/handler.mjs).
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  buildMessage,
  handle,
  parseSignup,
  returnPath,
} from '../workers/newsletter/src/handler.mjs';

const form = (fields) => {
  const f = new FormData();
  for (const [k, v] of Object.entries(fields)) f.set(k, v);
  return f;
};
const post = (fields, headers = {}) =>
  new Request('https://singletenant.ai/api/newsletter', {
    method: 'POST',
    body: form(fields),
    headers: {
      origin: 'https://singletenant.ai',
      referer: 'https://singletenant.ai/changelog/',
      ...headers,
    },
  });
const env = { FORM_DESTINATION: 'inbox@example.com' };
const good = { email: 'a@example.com', consent: 'yes', source: 'changelog' };

test('parseSignup validates email and consent, drops honeypot', () => {
  assert.equal(parseSignup(form(good)).ok, true);
  assert.equal(parseSignup(form({ ...good, email: 'nope' })).reason, 'email');
  assert.equal(parseSignup(form({ ...good, consent: '' })).reason, 'consent');
  assert.equal(parseSignup(form({ ...good, website: 'x' })).bot, true);
});

test('returnPath never leaves the site', () => {
  assert.equal(returnPath('https://singletenant.ai/guides/'), '/guides/');
  assert.equal(returnPath('https://evil.example/phish'), '/');
  assert.equal(returnPath('not a url'), '/');
});

test('unconfigured worker refuses with 503', async () => {
  const res = await handle(post(good), {}, undefined);
  assert.equal(res.status, 503);
});

test('non-POST and cross-origin requests are rejected', async () => {
  const get = new Request('https://singletenant.ai/api/newsletter');
  assert.equal((await handle(get, env, async () => {})).status, 405);
  const res = await handle(
    post(good, { origin: 'https://evil.example' }),
    env,
    async () => {},
  );
  assert.equal(res.status, 403);
});

test('valid no-JS signup sends once and 303s back to the page', async () => {
  const sent = [];
  const res = await handle(post(good), env, async (...args) => {
    sent.push(args);
  });
  assert.equal(res.status, 303);
  assert.equal(res.headers.get('location'), '/changelog/#newsletter-thanks');
  assert.equal(sent.length, 1);
  assert.match(sent[0][2], /Email: a@example\.com/);
});

test('fetch path gets JSON; bots get success with nothing sent', async () => {
  let calls = 0;
  const send = async () => {
    calls++;
  };
  const res = await handle(
    post({ ...good, website: 'spam' }, { accept: 'application/json' }),
    env,
    send,
  );
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(calls, 0);
});

test('invalid signup 303s to the error anchor', async () => {
  const res = await handle(post({ ...good, consent: '' }), env, async () => {});
  assert.equal(res.headers.get('location'), '/changelog/#newsletter-error');
});

test('buildMessage records the consent wording and time', () => {
  const raw = buildMessage(
    { email: 'a@example.com', source: 'guides' },
    { from: 'f@singletenant.ai', to: 't@example.com', now: new Date(0) },
  );
  assert.match(raw, /Consent given: 1970-01-01T00:00:00\.000Z/);
  assert.match(raw, /Consent wording: Email me singletenant\.ai updates/);
});
