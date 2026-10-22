// Pure request handling for the newsletter Worker, kept free of Cloudflare
// runtime imports so node --test can exercise it (tests/newsletter.test.mjs).
// index.mjs supplies the send function.

export const SITE_ORIGIN = 'https://singletenant.ai';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const CONSENT_TEXT =
  'Email me singletenant.ai updates. I can unsubscribe at any time.';

// Path to send a no-JS reader back to: the same-origin page they posted from,
// or the home page. Never an off-site URL (no open redirect).
export const returnPath = (referer, origin = SITE_ORIGIN) => {
  try {
    const url = new URL(referer);
    if (url.origin === origin) return url.pathname;
  } catch {}
  return '/';
};

/**
 * Validate a submitted form. Returns { ok: true, signup } or
 * { ok: false, reason }; a filled honeypot returns { ok: true, bot: true } so
 * bots get a success response and nothing is sent.
 * @param {FormData} form
 */
export const parseSignup = (form) => {
  if (String(form.get('website') ?? '') !== '') return { ok: true, bot: true };
  const email = String(form.get('email') ?? '').trim();
  if (email.length > 254 || !EMAIL.test(email))
    return { ok: false, reason: 'email' };
  if (form.get('consent') !== 'yes') return { ok: false, reason: 'consent' };
  const source = String(form.get('source') ?? '')
    .replace(/[^a-z0-9:-]/gi, '')
    .slice(0, 80);
  return { ok: true, signup: { email, source } };
};

// Plain-text notification to the editor's inbox: one signup per message, with
// the consent record (time, page, wording) the privacy policy promises.
export const buildMessage = ({ email, source }, { from, to, now }) => {
  const lines = [
    `Email: ${email}`,
    `Source: ${source || '-'}`,
    `Consent given: ${now.toISOString()}`,
    `Consent wording: ${CONSENT_TEXT}`,
  ];
  return [
    `From: "singletenant.ai newsletter" <${from}>`,
    `To: <${to}>`,
    `Reply-To: <${email}>`,
    'Subject: Newsletter signup',
    `Date: ${now.toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@singletenant.ai>`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset="utf-8"',
    '',
    lines.join('\r\n'),
  ].join('\r\n');
};

const respond = (request, ok, status) => {
  const wantsJson = (request.headers.get('accept') ?? '').includes(
    'application/json',
  );
  if (wantsJson)
    return new Response(JSON.stringify({ ok }), {
      status,
      headers: { 'content-type': 'application/json' },
    });
  const anchor = ok ? '#newsletter-thanks' : '#newsletter-error';
  const back = returnPath(request.headers.get('referer') ?? '');
  return new Response(null, {
    status: 303,
    headers: { location: `${back}${anchor}` },
  });
};

/**
 * @param {Request} request
 * @param {{ FORM_DESTINATION?: string, FROM_ADDRESS?: string, ALLOWED_ORIGIN?: string }} env
 * @param {(from: string, to: string, raw: string) => Promise<void>} [send]
 */
export const handle = async (request, env, send) => {
  if (request.method !== 'POST')
    return new Response('Method not allowed', {
      status: 405,
      headers: { allow: 'POST' },
    });
  const origin = request.headers.get('origin');
  if (origin && origin !== (env.ALLOWED_ORIGIN ?? SITE_ORIGIN))
    return new Response('Forbidden', { status: 403 });
  // Not configured yet: refuse rather than accept an address we cannot act on.
  if (!send || !env.FORM_DESTINATION)
    return new Response('Newsletter signup is not enabled', { status: 503 });

  let form;
  try {
    form = await request.formData();
  } catch {
    return respond(request, false, 400);
  }
  const result = parseSignup(form);
  if (!result.ok) return respond(request, false, 400);
  if (result.bot) return respond(request, true, 200);

  const from = env.FROM_ADDRESS ?? 'simon@singletenant.ai';
  try {
    await send(
      from,
      env.FORM_DESTINATION,
      buildMessage(result.signup, {
        from,
        to: env.FORM_DESTINATION,
        now: new Date(),
      }),
    );
  } catch (err) {
    console.error('send failed', err instanceof Error ? err.message : err);
    return respond(request, false, 502);
  }
  return respond(request, true, 200);
};
