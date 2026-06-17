import type { Language } from "./siteContent";

type ChatLocale = {
  metaTitle: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  assistantLabel: string;
  welcome: string;
  placeholder: string;
  send: string;
  reset: string;
  thinking: string;
  helperTitle: string;
  helperBody: string;
  capabilities: string[];
  examples: string[];
  sources: string;
  leadTool: string;
  statusTool: string;
  serverError: string;
  backToSite: string;
};

export const chatContent: Record<Language, ChatLocale> = {
  en: {
    metaTitle: "Chat with Ozthropic",
    eyebrow: "Bilingual AI Assistant",
    title: "English and Persian AI chat built around leads, answers, and follow-up.",
    subtitle:
      "This assistant shares one central brain across the website, widget, and Telegram. It can answer with RAG, remember context, capture leads, and check registration status.",
    assistantLabel: "Ozthropic Assistant",
    welcome:
      "Hello. I can help in English or Persian, answer questions from the Ozthropic knowledge base, capture your details for follow-up, and check registration status when you provide a reference, email, or phone number.",
    placeholder: "Type your message here...",
    send: "Send",
    reset: "New chat",
    thinking: "Thinking...",
    helperTitle: "What this chat can do",
    helperBody:
      "Ask service questions, request a callback, leave your details, or check an enrolment or registration status.",
    capabilities: [
      "RAG over Supabase + pgvector",
      "Short-term and long-term memory",
      "Lead capture tool",
      "Registration status lookup tool",
    ],
    examples: [
      "What AI systems do you build for Australian businesses?",
      "I want a consultation for my plumbing business.",
      "Can you check my registration status? My email is name@example.com",
      "به فارسی درباره خدمات‌تان توضیح بده",
    ],
    sources: "Sources",
    leadTool: "Lead captured",
    statusTool: "Status checked",
    serverError: "The assistant is not fully configured yet. Please add the server environment variables first.",
    backToSite: "Back to site",
  },
  fa: {
    metaTitle: "چت با Ozthropic",
    eyebrow: "دستیار دوزبانه هوش مصنوعی",
    title: "چت فارسی و انگلیسی برای پاسخ‌گویی، دریافت لید و پیگیری وضعیت ثبت‌نام.",
    subtitle:
      "این دستیار از یک هسته مرکزی مشترک در سایت، ویجت و تلگرام استفاده می‌کند. می‌تواند با RAG پاسخ بدهد، زمینه را به خاطر بسپارد، لید بگیرد و وضعیت ثبت‌نام را بررسی کند.",
    assistantLabel: "دستیار Ozthropic",
    welcome:
      "سلام. من می‌توانم به فارسی یا انگلیسی کمک کنم، از پایگاه دانش Ozthropic پاسخ بدهم، اطلاعات شما را برای پیگیری ثبت کنم و در صورت داشتن کد رهگیری، ایمیل یا شماره، وضعیت ثبت‌نام را بررسی کنم.",
    placeholder: "پیام‌تان را اینجا بنویسید...",
    send: "ارسال",
    reset: "چت جدید",
    thinking: "در حال فکر کردن...",
    helperTitle: "این چت چه کاری انجام می‌دهد",
    helperBody:
      "می‌توانید درباره خدمات بپرسید، درخواست تماس یا مشاوره بدهید، اطلاعات‌تان را ثبت کنید، یا وضعیت ثبت‌نام و پرونده را پیگیری کنید.",
    capabilities: [
      "RAG روی Supabase + pgvector",
      "حافظه کوتاه‌مدت و بلندمدت",
      "ابزار دریافت لید",
      "ابزار استعلام وضعیت ثبت‌نام",
    ],
    examples: [
      "چه سیستم‌های هوش مصنوعی برای کسب‌وکارهای استرالیایی می‌سازید؟",
      "برای کسب‌وکار من یک مشاوره می‌خواهم.",
      "می‌توانی وضعیت ثبت‌نام من را با ایمیل name@example.com بررسی کنی؟",
      "Explain your services in English.",
    ],
    sources: "منابع",
    leadTool: "لید ثبت شد",
    statusTool: "وضعیت بررسی شد",
    serverError: "دستیار هنوز کامل پیکربندی نشده است. ابتدا متغیرهای محیطی سمت سرور را اضافه کنید.",
    backToSite: "بازگشت به سایت",
  },
};

