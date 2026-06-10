import type { SiteContent } from "../content/siteContent";

type ServicesProps = {
  content: SiteContent;
};

export function Services({ content }: ServicesProps) {
  const { services, servicesIntro } = content;

  return (
    <section id="services" className="surface surface-contact-tint on-dark">
      <div className="section-inner">
        <div className="services-heading">
          <div className="reveal">
            <p className="eyebrow eyebrow-chip">{servicesIntro.eyebrow}</p>
            <h2>{servicesIntro.title}</h2>
          </div>
        </div>

        <div className="card-grid">
          {services.map((service) => (
            <article className="service-card reveal" key={service.number}>
              <div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul>
                  {service.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
