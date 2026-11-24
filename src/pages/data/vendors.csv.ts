// /data/vendors.csv: the open dataset as CSV, one row per vendor (see /data/).
import { getCollection } from 'astro:content';
import { datasetRecords, toCsv } from '../../lib/dataset.mjs';

export async function GET() {
  return new Response(toCsv(datasetRecords(await getCollection('vendors'))), {
    headers: { 'Content-Type': 'text/csv; charset=utf-8' },
  });
}
