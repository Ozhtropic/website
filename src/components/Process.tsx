import type { SiteContent } from "../content/siteContent";

type ProcessProps = {
  content: SiteContent;
};

export function Process({ content }: ProcessProps) {
  const { process, processIntro } = content;

  return (
    <section id="process" className="surface surface-transparent on-dark">
      <div className="section-inner">
        <div className="split-heading">
          <div className="reveal">
            <p className="eyebrow eyebrow-dark">{processIntro.eyebrow}</p>
            <h2>{processIntro.title}</h2>
          </div>
          <div className="glass-chip reveal">{processIntro.chip}</div>
        </div>

        <ol className="process-grid">
          {process.map((step) => (
            <li className="process-card glass-card reveal" key={step.number}>
              <div>
                <span className="process-number">{step.number}</span>
              </div>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
