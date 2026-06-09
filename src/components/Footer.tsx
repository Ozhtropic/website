import type { SiteContent } from "../content/siteContent";

type FooterProps = {
  content: SiteContent;
};

export function Footer({ content }: FooterProps) {
  const { footer } = content;

  return (
    <footer className="site-footer">
      <div className="footer-card">
        <div className="footer-intro">
          <p>{footer.blurb}</p>
        </div>
        <div className="footer-links">
          {footer.columns.map((column) => (
            <div key={column.title}>
              <h3>{column.title}</h3>
              {column.links.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="footer-legal">
        <span>{footer.legalLeft}</span>
        <span>{footer.legalRight}</span>
      </div>
    </footer>
  );
}
