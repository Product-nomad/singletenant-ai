// RSS 2.0 feed for the analysis articles. Hand-rolled to avoid adding a
// dependency; reads the same articles collection the /blog/ pages use, so any
// non-draft article appears here automatically. BaseLayout links /rss.xml.

import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

const SITE = 'https://singletenant.ai';

const ENTITIES: Record<string, string> = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  "'": '&apos;',
  '"': '&quot;',
};
const escapeXml = (value: string) =>
  value.replace(/[<>&'"]/g, (c) => ENTITIES[c] ?? c);

export const GET: APIRoute = async () => {
  const articles = (
    await getCollection('articles', ({ data }) => !data.draft)
  ).sort((a, b) => b.data.pub_date.valueOf() - a.data.pub_date.valueOf());

  const items = articles
    .map(
      (a) => `    <item>
      <title>${escapeXml(a.data.title)}</title>
      <link>${SITE}/blog/${a.id}/</link>
      <guid isPermaLink="true">${SITE}/blog/${a.id}/</guid>
      <description>${escapeXml(a.data.description)}</description>
      <pubDate>${a.data.pub_date.toUTCString()}</pubDate>
    </item>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>singletenant.ai</title>
    <link>${SITE}/</link>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Analysis on single-tenant LLM hosting, compliance, and vendor strategy for regulated industries.</description>
    <language>en-gb</language>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
