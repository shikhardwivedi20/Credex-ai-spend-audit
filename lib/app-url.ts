export function getAppUrl() {
  const explicit = process.env.NEXT_PUBLIC_APP_URL;
  if (explicit) return explicit;

  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (productionHost) {
    return productionHost.startsWith("http") ? productionHost : `https://${productionHost}`;
  }

  return "http://localhost:3001";
}
