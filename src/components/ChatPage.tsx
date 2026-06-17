import { useEffect, useRef, useState } from "react";
import type { Language, SiteContent } from "../content/siteContent";
import { chatContent } from "../content/chatContent";

type ChatPageProps = {
  language: Language;
  onLanguageChange: (language: Language) => void;
  brand: SiteContent["brand"];
};

type ChatResponse = {
  ok: boolean;
  reply?: string;
  sessionId?: string;
  sources?: Array<{ title: string; sourcePath: string | null }>;
  toolEvents?: Array<{ tool: string; ok: boolean; status: string | null }>;
  missingEnv?: string[];
  error?: string;
};

type Message = {
  id: string;
  role: "assistant" | "user";
  content: string;
  sources?: Array<{ title: string; sourcePath: string | null }>;
  toolEvents?: Array<{ tool: string; ok: boolean; status: string | null }>;
};

const SESSION_KEY = "ozthropic-chat-session";

function createSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function getStoredSessionId() {
  if (typeof window === "undefined") {
    return createSessionId();
  }

  const existing = window.localStorage.getItem(SESSION_KEY);
  if (existing) {
    return existing;
  }

  const next = createSessionId();
  window.localStorage.setItem(SESSION_KEY, next);
  return next;
}

function createWelcomeMessage(language: Language): Message {
  return {
    id: "welcome",
    role: "assistant",
    content: chatContent[language].welcome,
  };
}

export function ChatPage({ language, onLanguageChange, brand }: ChatPageProps) {
  const copy = chatContent[language];
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState<Message[]>([createWelcomeMessage(language)]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const threadRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSessionId(getStoredSessionId());
  }, []);

  useEffect(() => {
    document.title = copy.metaTitle;
  }, [copy.metaTitle]);

  useEffect(() => {
    setMessages((current) => {
      if (current.length === 1 && current[0]?.id === "welcome") {
        return [createWelcomeMessage(language)];
      }

      return current;
    });
  }, [language]);

  useEffect(() => {
    threadRef.current?.scrollTo({
      top: threadRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, pending]);

  const resetConversation = () => {
    const nextSession = createSessionId();
    window.localStorage.setItem(SESSION_KEY, nextSession);
    setSessionId(nextSession);
    setMessages([createWelcomeMessage(language)]);
    setInput("");
    setError(null);
  };

  const sendMessage = async (prefilledText?: string) => {
    const outgoing = (prefilledText ?? input).trim();
    if (!outgoing || pending || !sessionId) {
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: outgoing,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          userKey: `web:${sessionId}`,
          channel: "web",
          language,
          message: outgoing,
        }),
      });

      const data = (await response.json()) as ChatResponse;

      if (!response.ok || !data.ok || !data.reply) {
        throw new Error(data.error || copy.serverError);
      }

      if (data.sessionId && data.sessionId !== sessionId) {
        window.localStorage.setItem(SESSION_KEY, data.sessionId);
        setSessionId(data.sessionId);
      }

      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.reply || "",
          sources: data.sources || [],
          toolEvents: data.toolEvents || [],
        },
      ]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : copy.serverError);
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="chat-route">
      <div className="chat-topbar">
        <a className="chat-brand" href="/">
          <img src="/logos/ozthropic-lockup-light.svg" alt={brand.name} />
        </a>

        <div className="chat-topbar-actions">
          <div className="language-switch" aria-label="Language">
            <button
              type="button"
              className={language === "en" ? "is-active" : ""}
              aria-pressed={language === "en"}
              onClick={() => onLanguageChange("en")}
            >
              EN
            </button>
            <button
              type="button"
              className={language === "fa" ? "is-active" : ""}
              aria-pressed={language === "fa"}
              onClick={() => onLanguageChange("fa")}
            >
              FA
            </button>
          </div>

          <a className="button button-light chat-back-button" href="/">
            {copy.backToSite}
          </a>
        </div>
      </div>

      <section className="chat-layout">
        <aside className="chat-sidebar reveal">
          <span className="section-kicker">{copy.eyebrow}</span>
          <h1>{copy.title}</h1>
          <p>{copy.subtitle}</p>

          <div className="chat-helper-card">
            <h2>{copy.helperTitle}</h2>
            <p>{copy.helperBody}</p>
          </div>

          <div className="chat-capabilities">
            {copy.capabilities.map((item) => (
              <span key={item} className="chat-capability-pill">
                {item}
              </span>
            ))}
          </div>

          <div className="chat-example-list">
            {copy.examples.map((example) => (
              <button key={example} type="button" className="chat-example-button" onClick={() => sendMessage(example)}>
                {example}
              </button>
            ))}
          </div>
        </aside>

        <section className="chat-panel reveal">
          <div className="chat-panel-header">
            <div>
              <span className="chat-panel-label">{copy.assistantLabel}</span>
              <strong>{brand.tagline}</strong>
            </div>

            <button type="button" className="chat-reset-button" onClick={resetConversation}>
              {copy.reset}
            </button>
          </div>

          <div className="chat-thread" ref={threadRef}>
            {messages.map((message) => (
              <article key={message.id} className={`chat-message chat-message-${message.role}`}>
                <div className="chat-bubble">
                  <p>{message.content}</p>

                  {message.toolEvents?.length ? (
                    <div className="chat-message-tools">
                      {message.toolEvents.map((event, index) => (
                        <span key={`${event.tool}-${index}`} className="chat-tool-pill">
                          {event.tool === "capture_lead" ? copy.leadTool : copy.statusTool}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {message.sources?.length ? (
                    <div className="chat-message-sources">
                      <span>{copy.sources}</span>
                      {message.sources.map((source, index) => (
                        <small key={`${source.title}-${index}`}>{source.title}</small>
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
            ))}

            {pending ? (
              <article className="chat-message chat-message-assistant">
                <div className="chat-bubble">
                  <p>{copy.thinking}</p>
                </div>
              </article>
            ) : null}
          </div>

          {error ? <div className="chat-error">{error}</div> : null}

          <form
            className="chat-compose"
            onSubmit={(event) => {
              event.preventDefault();
              void sendMessage();
            }}
          >
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={copy.placeholder}
              rows={3}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void sendMessage();
                }
              }}
            />

            <button type="submit" className="button button-light" disabled={pending || !input.trim()}>
              {pending ? copy.thinking : copy.send}
            </button>
          </form>
        </section>
      </section>
    </main>
  );
}

