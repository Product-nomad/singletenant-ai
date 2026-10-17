// Feature flags for monetisation surfaces (reposition 2026-10). Both default
// off: flipping one is a reviewed code change, so a live ad slot or signup
// form always has a commit behind it. See /disclosure/ for the rules ads and
// sponsorship must follow, and AUDIT.md / the PR for what must be in place
// before turning each on.
export const FEATURES = {
  // Reserved, labelled ad slots outside the data (never in the matrix,
  // comparison tables or vendor facts). Off: slots render nothing.
  ads: false,
  // Newsletter signup on guides and the changelog, posting to the
  // singletenant-newsletter Worker (workers/newsletter/). Off: no form, and
  // the privacy policy omits the newsletter section. Turn on only after that
  // Worker is deployed with its route and FORM_DESTINATION secret.
  newsletter: false,
};

// Where the signup form posts. Served by the newsletter Worker's route on the
// singletenant.ai zone, not by the static site.
export const NEWSLETTER_ENDPOINT = '/api/newsletter';
