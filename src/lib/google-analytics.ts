const defaultMeasurementId = "G-3LVTY5N4B1";

declare global {
  interface Window {
    dataLayer?: unknown[][];
  }
}

export function enableGoogleAnalytics() {
  if (!import.meta.env.PROD) return;

  const measurementId =
    import.meta.env.VITE_GOOGLE_ANALYTICS_ID?.trim() || defaultMeasurementId;

  if (
    document.querySelector(`script[data-google-analytics="${measurementId}"]`)
  ) {
    return;
  }

  window.dataLayer = window.dataLayer ?? [];
  const gtag = (...args: unknown[]) => window.dataLayer?.push(args);

  gtag("js", new Date());
  gtag("config", measurementId);

  const script = document.createElement("script");
  script.async = true;
  script.dataset.googleAnalytics = measurementId;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
}
