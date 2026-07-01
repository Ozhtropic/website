import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { PromiseSection } from "./components/PromiseSection";
import { Process } from "./components/Process";
import { FinalCTA } from "./components/FinalCTA";
import { Footer } from "./components/Footer";
import { VideoBackdrop } from "./components/VideoBackdrop";
import { ChatPage } from "./components/ChatPage";
import { FloatingContactActions } from "./components/FloatingContactActions";
import { defaultLanguage, type Language, siteContent } from "./content/siteContent";
import { useRevealObserver } from "./hooks/useRevealObserver";
import { chatContent } from "./content/chatContent";

function getInitialLanguage(): Language {
  if (typeof window === "undefined") return defaultLanguage;
  const param = new URLSearchParams(window.location.search).get("lang");
  return param === "fa" ? "fa" : defaultLanguage;
}

export default function App() {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const content = siteContent[language];
  const isChatRoute = typeof window !== "undefined" && window.location.pathname === "/chat";

  useRevealObserver();

  useEffect(() => {
    document.documentElement.lang = language === "fa" ? "fa" : "en";
    document.documentElement.dir = language === "fa" ? "rtl" : "ltr";
    document.title = isChatRoute ? chatContent[language].metaTitle : content.meta.title;

    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute(
      "content",
      isChatRoute ? chatContent[language].subtitle : content.meta.description
    );
  }, [content, isChatRoute, language]);

  const handleLanguageChange = (nextLanguage: Language) => {
    setLanguage(nextLanguage);

    const nextUrl = new URL(window.location.href);
    if (nextLanguage === defaultLanguage) {
      nextUrl.searchParams.delete("lang");
    } else {
      nextUrl.searchParams.set("lang", nextLanguage);
    }
    window.history.replaceState(null, "", nextUrl);
  };

  return (
    <div className="app-shell grain" data-language={language}>
      <VideoBackdrop />
      <div className="page-layer">
        {isChatRoute ? (
          <ChatPage language={language} onLanguageChange={handleLanguageChange} brand={content.brand} />
        ) : (
          <>
            <Header content={content} language={language} onLanguageChange={handleLanguageChange} />
            <main>
              <Hero content={content} />
              <Services content={content} />
              <PromiseSection content={content} />
              <Process content={content} />
              <FinalCTA content={content} />
            </main>
            <Footer content={content} />
            <FloatingContactActions />
          </>
        )}
      </div>
    </div>
  );
}
