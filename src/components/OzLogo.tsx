import type { SiteContent } from "../content/siteContent";

const nodes: [number, number, number][] = [
  [16, 6, 2.4],
  [7, 12, 1.7],
  [25, 11, 1.9],
  [11, 22, 1.6],
  [21, 23, 2.0],
  [16, 15, 2.8],
  [27, 19, 1.4],
];

const links: [number, number][] = [
  [5, 0],
  [5, 1],
  [5, 2],
  [5, 3],
  [5, 4],
  [0, 2],
  [2, 6],
  [6, 4],
  [1, 3],
];

type OzLogoProps = {
  brand: SiteContent["brand"];
  tone?: "light" | "dark";
  compact?: boolean;
};

export function OzLogo({ brand, tone = "light", compact = false }: OzLogoProps) {
  const ink = tone === "light" ? "#ffffff" : "#1F1F1F";
  const line = tone === "light" ? "rgba(255,255,255,0.62)" : "rgba(31,31,31,0.5)";

  return (
    <a href="#top" className="logo-lockup" aria-label={`${brand.name} home`}>
      <svg viewBox="0 0 32 32" width="34" height="34" aria-hidden="true">
        <g stroke={line} strokeWidth="0.9">
          {links.map(([a, b], index) => (
            <line key={index} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} />
          ))}
        </g>
        {nodes.map(([x, y, r], index) => (
          <circle key={index} cx={x} cy={y} r={r} fill={ink} />
        ))}
      </svg>
      {!compact && (
        <span className="logo-text">
          <strong>{brand.name}</strong>
          <span>{brand.tagline}</span>
        </span>
      )}
    </a>
  );
}
