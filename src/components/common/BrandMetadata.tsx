import { useEffect } from "react";
import { useBranding } from "../../hooks/useBranding";

export default function BrandMetadata() {
  const { branding } = useBranding();

  useEffect(() => {
    document.title = `${branding.companyName} | Catálogo de impressão 3D`;
    let description = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    if (!description) {
      description = document.createElement("meta");
      description.name = "description";
      document.head.appendChild(description);
    }
    description.content = branding.tagline;
    let favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement("link");
      favicon.rel = "icon";
      document.head.appendChild(favicon);
    }
    if (branding.logoUrl) {
      favicon.href = branding.logoUrl;
    } else {
      const initials = branding.companyName.trim().slice(0, 2).toUpperCase();
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${branding.accentColor}"/><text x="32" y="43" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="29" fill="#111">${initials.replace(/[&<>"']/g, "")}</text></svg>`;
      favicon.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
    }
  }, [branding]);

  return null;
}
