import { ArrowUpRight, Mail } from "lucide-react";
import type { SiteContent } from "../content/siteContent";

type FinalCTAProps = {
  content: SiteContent;
};

export function FinalCTA({ content }: FinalCTAProps) {
  const { finalCta } = content;

  return (
    <section id="contact" className="final-cta on-dark">
      <div className="final-inner">
        <p className="eyebrow eyebrow-dark reveal">{finalCta.eyebrow}</p>
        <h2 className="reveal">{finalCta.title}</h2>
        <p className="reveal">{finalCta.body}</p>
        <div className="final-actions reveal">
          <a className="button button-light" href={finalCta.primary.href}>
            {finalCta.primary.label}
            <Mail size={16} strokeWidth={1.8} />
          </a>
          <a className="button button-ghost-dark" href={finalCta.secondary.href}>
            {finalCta.secondary.label}
            <ArrowUpRight size={16} strokeWidth={1.8} />
          </a>
        </div>
      </div>
    </section>
  );
}
