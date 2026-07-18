// Display labels for schema v2 enums, shared by matrix, detail, and
// compare templates so vendor-facing wording is defined once.

export const CATEGORY_LABELS = {
  'dedicated-gpu': 'Dedicated GPU',
  'hyperscaler-dedicated': 'Hyperscaler dedicated',
  'managed-selfhost': 'Managed self-host',
  'eu-sovereign': 'EU sovereign',
};

export const CERT_LABELS = {
  SOC2_TYPE2: 'SOC 2 Type II',
  SOC3: 'SOC 3',
  ISO27001: 'ISO 27001',
  HIPAA_BAA: 'HIPAA BAA',
  GDPR_DPA: 'GDPR DPA',
  C5: 'C5',
  SecNumCloud: 'SecNumCloud',
  FEDRAMP: 'FedRAMP',
};

// Deployment-model tokens are free strings in the schema (not a z.enum), but in
// practice they are a controlled vocabulary. Every value that appears in any
// vendor YAML must have a human label here: tests/labels.test.mjs walks the
// data and fails the build if a new token is unmapped, so a raw slug can never
// reach a table cell. Tokens stay unchanged in YAML, JSON-LD, and URLs.
export const DEPLOYMENT_LABELS = {
  'bare-metal': 'Bare metal',
  'community-cloud': 'Community Cloud',
  'custom-model-provisioned': 'Custom model (provisioned)',
  'custom-model-serving': 'Custom model serving',
  'data-zone-provisioned': 'Data-zone provisioned',
  'dedicated-deployment': 'Dedicated deployment',
  'dedicated-endpoint': 'Dedicated endpoint',
  'dedicated-endpoints': 'Dedicated endpoints',
  'dedicated-gpu-inference': 'Dedicated GPU inference',
  'dgx-cloud': 'DGX Cloud',
  'global-provisioned': 'Global provisioned',
  'gpu-clusters': 'GPU clusters',
  hybrid: 'Hybrid',
  'managed-kubernetes': 'Managed Kubernetes',
  'managed-model-deployment': 'Managed model deployment',
  'nvidia-hosted-api': 'NVIDIA-hosted API',
  'on-demand': 'On-demand',
  'on-demand-dedicated': 'On-demand dedicated',
  'pay-per-token-endpoints': 'Pay-per-token endpoints',
  'private-endpoint-privatelink': 'Private endpoint (PrivateLink)',
  'protected-endpoint': 'Protected endpoint',
  'provisioned-throughput': 'Provisioned throughput',
  'public-endpoint': 'Public endpoint',
  'regional-provisioned': 'Regional provisioned',
  'reserved-capacity': 'Reserved capacity',
  'reserved-clusters': 'Reserved clusters',
  'secure-cloud': 'Secure Cloud',
  serverless: 'Serverless',
  'serverless-api': 'Serverless API',
  'self-hosted': 'Self-hosted',
  'self-hosted-containers': 'Self-hosted containers',
  'single-zone-provisioned-throughput': 'Single-zone provisioned throughput',
  spot: 'Spot',
};

// Region buckets are a small controlled vocabulary too (coarse geographies,
// see the region-verification notes in the vendor YAML). Same mapping contract
// as deployment models: covered by tests/labels.test.mjs.
export const REGION_LABELS = {
  apac: 'Asia-Pacific',
  europe: 'Europe',
  global: 'Global',
  us: 'US',
};

/** @param {string} token */
export const deploymentLabel = (token) => DEPLOYMENT_LABELS[token] ?? token;
/** @param {string} token */
export const regionLabel = (token) => REGION_LABELS[token] ?? token;

export const NOT_VERIFIED = 'Not verified';

export const CHANGE_TYPE_LABELS = {
  added: 'Added',
  updated: 'Updated',
  removed: 'Removed',
  corrected: 'Corrected',
};
