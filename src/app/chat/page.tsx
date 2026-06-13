"use client";

import { useEffect, useState, useRef } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  flagged?: boolean;
  grounding_source?: string;
  resources?: Array<{ name: string; phone: string; availability: string }>;
}

const PRESETS = [
  "I'm feeling completely burned out by the syllabus load.",
  "I scored poorly on my mock test today and feel anxious.",
  "My parents have high expectations and I feel overwhelmed.",
  "How can I manage exam anxiety right before entering the hall?"
];

export default function ChatPage() {
  const [userId, setUserId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let currentSessionId = localStorage.getItem("mindguard_session_id");
    if (!currentSessionId) {
      currentSessionId = crypto.randomUUID();
      localStorage.setItem("mindguard_session_id", currentSessionId);
    }
    setUserId(currentSessionId);
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/chat?user_id=${userId}`);
        const json = await res.json();
        if (json.success && json.data) {
          setMessages(json.data);
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    };

    fetchHistory();
  }, [userId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    setError("");

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          message: text,
          // Pass the previous 6 clean messages for context
          history: messages.slice(-6).map(m => ({ role: m.role, content: m.content }))
        })
      });

      const json = await response.json();
      if (json.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: json.response,
            flagged: json.flagged,
            grounding_source: json.grounding_source,
            resources: json.resources
          }
        ]);
      } else {
        setError(json.error || "Failed to process message.");
      }
    } catch (err) {
      setError("Failed to connect to the wellness agent. Please check your network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 flex flex-col h-[calc(100vh-8rem)] bg-slate-950">
      {/* Page Header */}
      <div className="mb-4 flex-none">
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
          Empathetic AI Companion
        </h1>
        <p className="text-slate-400 text-xs mt-0.5">
          Ask questions about exam anxiety, burnout management, or coping strategies. Strictly bounded to student wellness.
        </p>
      </div>

      {/* Messages Thread Container */}
      <div className="flex-1 min-h-0 rounded-2xl border border-slate-900 bg-slate-900/10 backdrop-blur-sm p-4 overflow-y-auto space-y-4 flex flex-col mb-4">
        {messages.length === 0 ? (
          /* Welcome Onboarding */
          <div className="my-auto text-center max-w-md mx-auto space-y-6 py-8">
            <span className="text-5xl block animate-bounce">🛡️</span>
            <div>
              <h2 className="text-lg font-bold text-slate-200">Welcome to your Safe Space</h2>
              <p className="text-xs text-slate-400 leading-normal mt-2">
                I am your digital wellness companion. Ask me anything about managing board exam or competitive test pressure. Try clicking one of the suggestions below to start:
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-2.5 text-left">
              {PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(preset)}
                  className="w-full text-left p-3 rounded-xl border border-slate-800 bg-slate-950/40 hover:bg-slate-900/60 hover:border-indigo-500/30 transition-all text-xs text-slate-300 font-semibold"
                >
                  💡 {preset}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Message bubbles */
          <div className="space-y-4 flex-1">
            {messages.map((msg, idx) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={idx}
                  className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                      isUser
                        ? "bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/5"
                        : msg.flagged
                        ? "bg-rose-500/10 border border-rose-500/35 text-rose-200 rounded-bl-none"
                        : "bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none"
                    }`}
                  >
                    {/* Header for crisis alerts */}
                    {!isUser && msg.flagged && (
                      <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs mb-2">
                        🚨 SAFETY BYPASS ACTIVATED
                      </div>
                    )}

                    <p>{msg.content}</p>

                    {/* Resources for crisis alerts */}
                    {!isUser && msg.flagged && msg.resources && (
                      <div className="mt-4 space-y-3 pt-3 border-t border-rose-500/20">
                        <p className="text-xs font-bold text-rose-300">Indian National Helplines:</p>
                        <div className="grid grid-cols-1 gap-2">
                          {msg.resources.map((res, rIdx) => (
                            <div key={rIdx} className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-lg flex flex-col justify-between">
                              <span className="font-bold text-xs text-rose-200">{res.name}</span>
                              <a
                                href={`tel:${res.phone.replace(/[^0-9+]/g, "")}`}
                                className="text-indigo-400 text-xs font-extrabold hover:underline mt-1.5 flex items-center gap-1"
                              >
                                📞 Call {res.phone}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Grounding Source Citation */}
                    {!isUser && !msg.flagged && msg.grounding_source && (
                      <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-1">
                        <span>🛡️ Source:</span>
                        <span className="italic font-medium text-slate-400">{msg.grounding_source}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Loading / Typing Skeleton Indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl rounded-bl-none p-4 bg-slate-900 border border-slate-800 text-slate-400 text-xs flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="h-1.5 w-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                  <span>Empathetic Companion is responding...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 mb-3 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 text-xs flex-none">
          ⚠️ {error}
        </div>
      )}

      {/* Input panel */}
      <div className="flex-none flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputText)}
          placeholder="Describe your stress, ask for relaxation techniques, or just talk..."
          className="flex-1 bg-slate-900 border border-slate-850 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-650 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/35 transition-all text-sm resize-none"
        />
        <button
          onClick={() => handleSendMessage(inputText)}
          disabled={loading || !inputText.trim()}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-5 rounded-xl transition-all hover:scale-101 shadow-md shadow-indigo-600/5 disabled:opacity-50 disabled:pointer-events-none text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}
