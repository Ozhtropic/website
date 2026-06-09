export type Language = "en" | "fa";

type RailItem =
  | { type: "spacer" }
  | { type: "muted" | "label" | "hero" | "body"; text: string };

type Link = {
  label: string;
  href: string;
};

export type SiteContent = {
  meta: {
    title: string;
    description: string;
  };
  ui: {
    booking: string;
    bookingConsultation: string;
    languageLabel: string;
    english: string;
    persian: string;
    menuLabel: string;
    navLabel: string;
    scrollCue: string;
    startConversation: string;
    seeServices: string;
  };
  brand: {
    name: string;
    tagline: string;
    founder: string;
    location: string;
    email: string;
    bookingUrl: string;
    website: string;
    instagram: string;
  };
  navLinks: Link[];
  heroStages: Array<{
    eyebrow: string;
    title: string;
    accent: string;
    body: string;
  }>;
  heroRail: RailItem[];
  servicesIntro: {
    eyebrow: string;
    title: string;
    note: string;
  };
  services: Array<{
    number: string;
    title: string;
    description: string;
    tags: string[];
  }>;
  promise: {
    eyebrow: string;
    title: string;
    body: string;
    proof: Array<{ label: string; text: string }>;
  };
  processIntro: {
    eyebrow: string;
    title: string;
    chip: string;
  };
  process: Array<{
    number: string;
    title: string;
    body: string;
  }>;
  finalCta: {
    eyebrow: string;
    title: string;
    body: string;
    primary: Link;
    secondary: Link;
  };
  footer: {
    blurb: string;
    legalLeft: string;
    legalRight: string;
    columns: Array<{ title: string; links: Link[] }>;
  };
};

const brandBase = {
  name: "Ozthropic",
  founder: "Daryoosh Asadi",
  email: "hello@ozthropic.com",
  bookingUrl: "https://calendar.app.google/XbXdMXJdbpxisEH16",
  website: "www.ozthropic.com",
  instagram: "@ozthropic",
};

const en: SiteContent = {
  meta: {
    title: "Ozthropic | Human-Centric AI for Australian Businesses",
    description:
      "Ozthropic helps Australian small and medium-sized businesses reclaim time and capital with human-centric AI automation.",
  },
  ui: {
    booking: "Book a consultation",
    bookingConsultation: "Book a consultation",
    languageLabel: "Language",
    english: "EN",
    persian: "FA",
    menuLabel: "Toggle menu",
    navLabel: "Primary navigation",
    scrollCue: "Scroll to explore",
    startConversation: "Start a conversation",
    seeServices: "See services",
  },
  brand: {
    ...brandBase,
    tagline: "Human-Centric AI for Australian Businesses",
    location: "Australia",
  },
  navLinks: [
    { label: "Services", href: "#services" },
    { label: "Promise", href: "#promise" },
    { label: "Process", href: "#process" },
    { label: "Contact", href: "#contact" },
  ],
  heroStages: [
    {
      eyebrow: "Australian AI Consultancy",
      title: "AI built around people, not the other way around.",
      accent: "people",
      body:
        "Ozthropic designs intelligent automation for Australian small and medium-sized businesses, with the humans who use it kept firmly at the centre.",
    },
    {
      eyebrow: "Less overhead. More growth.",
      title: "Reclaim the hours hiding inside admin, calls, email, and follow-up.",
      accent: "hours",
      body:
        "AI phone agents, booking workflows, inbox triage, quoting, invoicing, and marketing systems that keep work moving while you run the business.",
    },
    {
      eyebrow: "Affordable to start. Fair to stay.",
      title: "Experience the value first, then scale what is working.",
      accent: "value",
      body:
        "Low-cost entry pricing helps you prove the return without risk. Once results are visible, ongoing maintenance stays fair and practical.",
    },
  ],
  heroRail: [
    { type: "muted", text: "Australia" },
    { type: "muted", text: "Small and medium-sized businesses" },
    { type: "spacer" },
    { type: "label", text: "Core systems" },
    { type: "hero", text: "AI phone agents" },
    { type: "body", text: "Bookings · CRM · reminders" },
    { type: "body", text: "Email summaries · draft replies" },
    { type: "spacer" },
    { type: "label", text: "Built for" },
    { type: "body", text: "Tradies and home services" },
    { type: "body", text: "Salons, clinics, hospitality" },
    { type: "body", text: "Professional services" },
    { type: "spacer" },
    { type: "label", text: "Promise" },
    { type: "hero", text: "Built around the humans who use it." },
    { type: "spacer" },
    { type: "label", text: "Start" },
    { type: "body", text: brandBase.email },
  ],
  servicesIntro: {
    eyebrow: "What we build",
    title: "Practical AI systems for the parts of business that quietly eat the week.",
    note:
      "Built for owners and teams who are hands-on with clients, bookings, phones, quoting, emails, and daily follow-up.",
  },
  services: [
    {
      number: "01",
      title: "AI Phone Agents",
      description:
        "Friendly virtual receptionists that answer calls, qualify enquiries, and book appointments based on real-time availability.",
      tags: ["Calls", "Bookings", "Qualification"],
    },
    {
      number: "02",
      title: "Automated Booking & CRM",
      description:
        "Client management, reminders, follow-ups, and appointment workflows handled automatically without adding more admin.",
      tags: ["CRM", "Reminders", "Follow-up"],
    },
    {
      number: "03",
      title: "Email Triage & Summaries",
      description:
        "Inboxes summarised, prioritised, and drafted so owners spend minutes, not hours, deciding what needs attention.",
      tags: ["Inbox", "Summaries", "Drafts"],
    },
    {
      number: "04",
      title: "Quoting & Invoicing",
      description:
        "Faster quote and invoice turnaround to keep jobs moving, reduce forgotten follow-ups, and protect cash flow.",
      tags: ["Quotes", "Invoices", "Cash flow"],
    },
    {
      number: "05",
      title: "Social & Advertising",
      description:
        "AI-assisted content and campaigns that keep the business visible without needing daily manual input.",
      tags: ["Content", "Campaigns", "Visibility"],
    },
    {
      number: "06",
      title: "Strategy & Maintenance",
      description:
        "Ongoing reviews, optimisation, and fair-priced support that keeps the systems reliable as the business grows.",
      tags: ["Reviews", "Optimisation", "Support"],
    },
  ],
  promise: {
    eyebrow: "The Ozthropic promise",
    title: "Affordable to start. Fair to stay. Built around the humans who use it.",
    body:
      "AI should not only be for big companies. Ozthropic gives small and medium-sized businesses a practical way to test automation, see the value, and then keep improving what works.",
    proof: [
      { label: "Efficiency", text: "Every system must measurably give time back." },
      { label: "Accessibility", text: "Designed for teams without in-house tech expertise." },
      { label: "Reliability", text: "Built to keep running while owners get on with the work." },
      { label: "Transparency", text: "Clear pricing, honest scope, visible results." },
    ],
  },
  processIntro: {
    eyebrow: "How it starts",
    title: "One useful workflow first. Then the next one.",
    chip: "Four steps · clear scope · visible value",
  },
  process: [
    {
      number: "01",
      title: "Map the work",
      body:
        "We learn where time, money, and attention leak out of the business before recommending any automation.",
    },
    {
      number: "02",
      title: "Build the useful first version",
      body:
        "We start with the workflow most likely to return time quickly, keeping the system plain-spoken and usable.",
    },
    {
      number: "03",
      title: "Prove the value",
      body:
        "The first version is measured against real outcomes: calls handled, leads followed up, hours saved, money recovered.",
    },
    {
      number: "04",
      title: "Maintain and improve",
      body:
        "Once the result is clear, ongoing support keeps the automation reliable, fair-priced, and aligned to growth.",
    },
  ],
  finalCta: {
    eyebrow: "Start with one workflow",
    title: "Less overhead. More growth.",
    body:
      "Tell us where the admin is dragging. We will help find the first useful AI system for the way your business actually works.",
    primary: { label: "Email Ozthropic", href: `mailto:${brandBase.email}` },
    secondary: { label: "Explore services", href: "#services" },
  },
  footer: {
    blurb: "Human-Centric AI for Australian businesses, built around people, not just systems.",
    legalLeft: "© 2026 Ozthropic. Australia.",
    legalRight: "Human-Centric AI for Australian Businesses",
    columns: [
      {
        title: "Company",
        links: [
          { label: "Services", href: "#services" },
          { label: "Promise", href: "#promise" },
          { label: "Process", href: "#process" },
        ],
      },
      {
        title: "Contact",
        links: [
          { label: brandBase.email, href: `mailto:${brandBase.email}` },
          { label: brandBase.website, href: "https://www.ozthropic.com" },
          { label: brandBase.instagram, href: "https://instagram.com/ozthropic" },
        ],
      },
    ],
  },
};

const fa: SiteContent = {
  meta: {
    title: "Ozthropic | هوش مصنوعی انسان‌محور برای کسب‌وکارهای استرالیایی",
    description:
      "Ozthropic به کسب‌وکارهای کوچک و متوسط استرالیا کمک می‌کند با اتوماسیون هوش مصنوعی، زمان و سرمایه خود را آزاد کنند.",
  },
  ui: {
    booking: "رزرو",
    bookingConsultation: "رزرو مشاوره",
    languageLabel: "زبان",
    english: "EN",
    persian: "FA",
    menuLabel: "باز و بسته کردن منو",
    navLabel: "ناوبری اصلی",
    scrollCue: "برای ادامه اسکرول کنید",
    startConversation: "شروع گفتگو",
    seeServices: "مشاهده خدمات",
  },
  brand: {
    ...brandBase,
    tagline: "هوش مصنوعی انسان‌محور برای کسب‌وکارهای استرالیایی",
    location: "سیدنی، استرالیا",
  },
  navLinks: [
    { label: "خدمات", href: "#services" },
    { label: "تعهد ما", href: "#promise" },
    { label: "فرآیند", href: "#process" },
    { label: "تماس", href: "#contact" },
  ],
  heroStages: [
    {
      eyebrow: "مشاوره هوش مصنوعی در استرالیا",
      title: "هوش مصنوعی برای آدم‌ها ساخته می‌شود، نه برعکس.",
      accent: "آدم‌ها",
      body:
        "Ozthropic برای کسب‌وکارهای کوچک و متوسط استرالیا اتوماسیون هوشمند طراحی می‌کند؛ با تمرکز روشن بر انسان‌هایی که قرار است از آن استفاده کنند.",
    },
    {
      eyebrow: "هزینه کمتر. رشد بیشتر.",
      title: "ساعت‌هایی را که در کارهای اداری، تماس‌ها، ایمیل و پیگیری‌ها گم می‌شوند پس بگیرید.",
      accent: "ساعت‌هایی",
      body:
        "ایجنت‌های تلفنی هوشمند، سیستم رزرو، مدیریت مشتری، خلاصه‌سازی ایمیل، صدور پیش‌فاکتور و فاکتور، و بازاریابی خودکار که کار را جلو می‌برد.",
    },
    {
      eyebrow: "شروع مقرون‌به‌صرفه. ادامه منصفانه.",
      title: "اول ارزش را تجربه کنید، بعد همان چیزی را که جواب می‌دهد گسترش دهید.",
      accent: "ارزش",
      body:
        "قیمت‌گذاری کم‌ریسک در شروع کمک می‌کند بازده را ببینید. وقتی نتیجه روشن شد، نگهداری و بهینه‌سازی با هزینه‌ای منصفانه ادامه پیدا می‌کند.",
    },
  ],
  heroRail: [
    { type: "muted", text: "سیدنی · استرالیا" },
    { type: "muted", text: "کسب‌وکارهای کوچک و متوسط" },
    { type: "spacer" },
    { type: "label", text: "سیستم‌های اصلی" },
    { type: "hero", text: "ایجنت‌های تلفنی هوشمند" },
    { type: "body", text: "رزرو · CRM · یادآوری‌ها" },
    { type: "body", text: "خلاصه ایمیل · پیش‌نویس پاسخ" },
    { type: "spacer" },
    { type: "label", text: "مناسب برای" },
    { type: "body", text: "خدمات خانگی و فنی" },
    { type: "body", text: "سالن‌ها، کلینیک‌ها، مهمان‌داری" },
    { type: "body", text: "خدمات حرفه‌ای" },
    { type: "spacer" },
    { type: "label", text: "تعهد" },
    { type: "hero", text: "ساخته‌شده بر محور انسان‌هایی که از آن استفاده می‌کنند." },
    { type: "spacer" },
    { type: "label", text: "شروع" },
    { type: "body", text: brandBase.email },
  ],
  servicesIntro: {
    eyebrow: "آنچه می‌سازیم",
    title: "سیستم‌های کاربردی هوش مصنوعی برای بخش‌هایی از کسب‌وکار که آرام‌آرام هفته را می‌بلعند.",
    note:
      "برای صاحبان کسب‌وکار و تیم‌هایی ساخته شده که هر روز با مشتری، رزرو، تلفن، پیش‌فاکتور، ایمیل و پیگیری سروکار دارند.",
  },
  services: [
    {
      number: "01",
      title: "ایجنت‌های تلفنی هوشمند",
      description:
        "پذیرش مجازی دوستانه که تماس‌ها را پاسخ می‌دهد، درخواست‌ها را ارزیابی می‌کند و بر اساس ظرفیت واقعی، وقت رزرو می‌کند.",
      tags: ["تماس", "رزرو", "ارزیابی"],
    },
    {
      number: "02",
      title: "رزرو و CRM خودکار",
      description:
        "مدیریت مشتری، یادآوری‌ها، پیگیری‌ها و جریان رزرو بدون اضافه شدن کار اداری بیشتر انجام می‌شود.",
      tags: ["CRM", "یادآوری", "پیگیری"],
    },
    {
      number: "03",
      title: "مرتب‌سازی و خلاصه ایمیل",
      description:
        "ایمیل‌ها خلاصه، اولویت‌بندی و پیش‌نویس می‌شوند تا به جای چند ساعت، در چند دقیقه تصمیم بگیرید چه چیزی مهم است.",
      tags: ["ایمیل", "خلاصه", "پیش‌نویس"],
    },
    {
      number: "04",
      title: "پیش‌فاکتور و فاکتور",
      description:
        "ارسال سریع‌تر پیش‌فاکتور و فاکتور برای جلو رفتن کارها، کاهش پیگیری‌های فراموش‌شده و سالم ماندن جریان نقدی.",
      tags: ["پیش‌فاکتور", "فاکتور", "جریان نقدی"],
    },
    {
      number: "05",
      title: "شبکه‌های اجتماعی و تبلیغات",
      description:
        "محتوا و کمپین‌های کمک‌گرفته از هوش مصنوعی که کسب‌وکار را بدون نیاز به کار دستی روزانه در معرض دید نگه می‌دارد.",
      tags: ["محتوا", "کمپین", "دیده‌شدن"],
    },
    {
      number: "06",
      title: "استراتژی و نگهداری",
      description:
        "بازبینی، بهینه‌سازی و پشتیبانی منصفانه که سیستم‌ها را قابل اعتماد نگه می‌دارد و همراه رشد کسب‌وکار حرکت می‌کند.",
      tags: ["بازبینی", "بهینه‌سازی", "پشتیبانی"],
    },
  ],
  promise: {
    eyebrow: "تعهد Ozthropic",
    title: "شروع مقرون‌به‌صرفه. ادامه منصفانه. ساخته‌شده برای انسان‌هایی که از آن استفاده می‌کنند.",
    body:
      "هوش مصنوعی نباید فقط برای شرکت‌های بزرگ باشد. Ozthropic به کسب‌وکارهای کوچک و متوسط راهی عملی می‌دهد تا اتوماسیون را امتحان کنند، ارزش آن را ببینند و سپس همان چیزی را بهتر کنند که واقعاً جواب می‌دهد.",
    proof: [
      { label: "بهره‌وری", text: "هر سیستم باید به شکل قابل اندازه‌گیری زمان را به شما برگرداند." },
      { label: "دسترسی‌پذیری", text: "برای تیم‌هایی طراحی شده که متخصص فنی داخلی ندارند." },
      { label: "قابل اعتماد", text: "ساخته شده تا در پس‌زمینه کار کند، وقتی شما مشغول اداره کسب‌وکار هستید." },
      { label: "شفافیت", text: "قیمت روشن، محدوده صادقانه، نتیجه قابل مشاهده." },
    ],
  },
  processIntro: {
    eyebrow: "از کجا شروع می‌کنیم",
    title: "اول یک جریان کاری مفید. بعد جریان بعدی.",
    chip: "چهار مرحله · محدوده روشن · ارزش قابل مشاهده",
  },
  process: [
    {
      number: "01",
      title: "نقشه‌برداری کار",
      body:
        "قبل از پیشنهاد هر اتوماسیونی، می‌فهمیم زمان، پول و توجه در کجای کسب‌وکار هدر می‌رود.",
    },
    {
      number: "02",
      title: "ساخت نسخه اول کاربردی",
      body:
        "از جریانی شروع می‌کنیم که بیشترین احتمال را دارد سریع زمان را برگرداند؛ ساده، قابل فهم و قابل استفاده.",
    },
    {
      number: "03",
      title: "اثبات ارزش",
      body:
        "نسخه اول با خروجی واقعی سنجیده می‌شود: تماس‌های پاسخ‌داده‌شده، سرنخ‌های پیگیری‌شده، ساعت‌های ذخیره‌شده و پول برگشته.",
    },
    {
      number: "04",
      title: "نگهداری و بهبود",
      body:
        "وقتی نتیجه روشن شد، پشتیبانی ادامه‌دار سیستم را قابل اعتماد، منصفانه و هم‌راستا با رشد نگه می‌دارد.",
    },
  ],
  finalCta: {
    eyebrow: "با یک جریان کاری شروع کنید",
    title: "هزینه کمتر. رشد بیشتر.",
    body:
      "به ما بگویید کدام کار اداری سرعت شما را می‌گیرد. کمک می‌کنیم اولین سیستم هوش مصنوعی مفید را برای مدل واقعی کسب‌وکارتان پیدا کنید.",
    primary: { label: "ایمیل به Ozthropic", href: `mailto:${brandBase.email}` },
    secondary: { label: "مشاهده خدمات", href: "#services" },
  },
  footer: {
    blurb: "هوش مصنوعی انسان‌محور برای کسب‌وکارهای استرالیایی؛ ساخته‌شده بر محور انسان، نه فقط سیستم.",
    legalLeft: "© 2026 Ozthropic. سیدنی، استرالیا.",
    legalRight: "هوش مصنوعی انسان‌محور برای کسب‌وکارهای استرالیایی",
    columns: [
      {
        title: "شرکت",
        links: [
          { label: "خدمات", href: "#services" },
          { label: "تعهد ما", href: "#promise" },
          { label: "فرآیند", href: "#process" },
        ],
      },
      {
        title: "تماس",
        links: [
          { label: brandBase.email, href: `mailto:${brandBase.email}` },
          { label: brandBase.website, href: "https://www.ozthropic.com" },
          { label: brandBase.instagram, href: "https://instagram.com/ozthropic" },
        ],
      },
    ],
  },
};

export const siteContent = { en, fa } satisfies Record<Language, SiteContent>;

export const defaultLanguage: Language = "en";
