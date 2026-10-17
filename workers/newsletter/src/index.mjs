// singletenant-newsletter: receives newsletter signups posted to
// singletenant.ai/api/newsletter and emails each one, with its consent record,
// to the editor's verified Email Routing destination (FORM_DESTINATION).
// Request handling lives in handler.mjs; this file only binds the Cloudflare
// send_email API. Not deployed yet; see workers/newsletter/README.md.
import { EmailMessage } from 'cloudflare:email';
import { handle } from './handler.mjs';

export default {
  async fetch(request, env) {
    const send = env.SEND_EMAIL
      ? (from, to, raw) => env.SEND_EMAIL.send(new EmailMessage(from, to, raw))
      : undefined;
    return handle(request, env, send);
  },
};
