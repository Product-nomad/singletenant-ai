// RSS 2.0 feed at /rss.xml — matches the <link rel="alternate"> in BaseLayout.
// Hand-rolled (no @astrojs/rss dependency): the article set is small and the
// output is a handful of fields. Prerendered as a static endpoint at build.
import { getCollection } from 'astro:content';

const SITE = 'https://singletenant.ai';

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export async function GET() {
  const articles = (
    await getCollection('articles', ({ data }) => !data.draft)
  ).sort((a, b) => b.data.pub_date.valueOf() - a.data.pub_date.valueOf());

  const items = articles
    .map((a) => {
      const url = `${SITE}/blog/${a.id}/`;
      return `    <item>
      <title>${esc(a.data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${esc(a.data.description)}</description>
      <pubDate>${a.data.pub_date.toUTCString()}</pubDate>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>singletenant.ai</title>
    <link>${SITE}/</link>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Evidence-linked reference data and analysis on dedicated and single-tenant LLM hosting.</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
