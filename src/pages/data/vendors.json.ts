// /data/vendors.json: the open dataset as JSON (see /data/).
import { getCollection } from 'astro:content';
import { loadChangelog } from '../../lib/changelog.mjs';
import { datasetJson, datasetRecords } from '../../lib/dataset.mjs';

export async function GET() {
  const [latest] = loadChangelog();
  const body = datasetJson(
    datasetRecords(await getCollection('vendors')),
    latest.date,
  );
  return new Response(`${JSON.stringify(body, null, 2)}\n`, {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
