import type { SiteContent } from "../content/siteContent";

type PromiseSectionProps = {
  content: SiteContent;
};

export function PromiseSection({ content }: PromiseSectionProps) {
  const { promise } = content;

  return (
    <section id="promise" className="surface surface-transparent on-dark">
      <div className="section-inner promise-layout">
        <div className="promise-statement reveal">
          <p className="eyebrow eyebrow-dark">{promise.eyebrow}</p>
          <h2>{promise.title}</h2>
          <p>{promise.body}</p>
        </div>

        <div className="promise-proof">
          {promise.proof.map((item) => (
            <article className="glass-card reveal" key={item.label}>
              <span>{item.label}</span>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
