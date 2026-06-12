import type { SiteContent } from "../content/siteContent";

type OzLogoProps = {
  brand: SiteContent["brand"];
  tone?: "light" | "dark";
  compact?: boolean;
};

export function OzLogo({ brand, tone = "light", compact = false }: OzLogoProps) {
  const logoSrc = compact
    ? tone === "light"
      ? "/logos/ozthropic-mark-mono-white.svg"
      : "/logos/ozthropic-mark-mono-black.svg"
    : tone === "light"
    ? "/logos/ozthropic-lockup-light.svg"
    : "/logos/ozthropic-lockup-dark.svg";

  return (
    <a href="#top" className={`logo-lockup${compact ? " is-compact" : ""}`} aria-label={`${brand.name} home`}>
      <img src={logoSrc} alt="" aria-hidden="true" decoding="async" />
    </a>
  );
}
