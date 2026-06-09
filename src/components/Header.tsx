import { useState } from "react";
import { ArrowUpRight, CalendarDays, Menu, X } from "lucide-react";
import type { Language, SiteContent } from "../content/siteContent";
import { OzLogo } from "./OzLogo";

type HeaderProps = {
  content: SiteContent;
  language: Language;
  onLanguageChange: (language: Language) => void;
};

export function Header({ content, language, onLanguageChange }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const { brand, navLinks, ui } = content;

  return (
    <header className="site-header">
      <div className="header-inner">
        <OzLogo brand={brand} />

        <nav className="nav-pill" aria-label={ui.navLabel}>
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <LanguageSwitch content={content} language={language} onLanguageChange={onLanguageChange} />
          <a className="button button-light header-cta" href={brand.bookingUrl} target="_blank" rel="noreferrer">
            {ui.booking}
            <CalendarDays size={16} strokeWidth={1.8} />
          </a>
        </div>

        <button
          className="menu-button"
          type="button"
          aria-label={ui.menuLabel}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="mobile-menu">
          <LanguageSwitch content={content} language={language} onLanguageChange={onLanguageChange} />
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <a
            className="button button-light"
            href={brand.bookingUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
          >
            {ui.bookingConsultation}
            <ArrowUpRight size={16} strokeWidth={1.8} />
          </a>
        </div>
      )}
    </header>
  );
}

function LanguageSwitch({ content, language, onLanguageChange }: HeaderProps) {
  const { ui } = content;

  return (
    <div className="language-switch" aria-label={ui.languageLabel}>
      <button
        type="button"
        className={language === "en" ? "is-active" : ""}
        aria-pressed={language === "en"}
        onClick={() => onLanguageChange("en")}
      >
        {ui.english}
      </button>
      <button
        type="button"
        className={language === "fa" ? "is-active" : ""}
        aria-pressed={language === "fa"}
        onClick={() => onLanguageChange("fa")}
      >
        {ui.persian}
      </button>
    </div>
  );
}
