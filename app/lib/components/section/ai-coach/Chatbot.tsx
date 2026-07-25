import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Send, Sparkles, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "~/components/ui/avatar";
import { getToken } from "~/lib/utils/tokenStore";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatHistoryItem {
  id: number;
  question: string;
  response: string;
  created_at: string;
}

const INITIAL_MESSAGE: Message = {
  id: "init",
  role: "assistant",
  content:
    "Hello! I'm your AI Financial Coach. I'm here to help you make smarter financial decisions, answer your money questions, and provide personalized guidance based on your financial data. How can I assist you today?",
  timestamp: new Date(),
};

const SUGGESTED_QUESTIONS = [
  "How can I reduce my monthly expenses?",
  "Am I on track to meet my emergency fund goal?",
  "What percentage of my income should I save?",
  "How can I improve my spending habits?",
];

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const baseApi = import.meta.env.VITE_REACT_BASE_API_URL || "";

  useEffect(() => {
    async function loadHistory() {
      const token = getToken();
      if (!token) return;
      try {
        const res = await fetch(`${baseApi}/auth/v1/chat/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const { data }: { data: ChatHistoryItem[] } = await res.json();
        if (!data || data.length === 0) return;
        const historyMessages: Message[] = data.flatMap((item) => [
          {
            id: `h-user-${item.id}`,
            role: "user" as const,
            content: item.question,
            timestamp: new Date(item.created_at),
          },
          {
            id: `h-assistant-${item.id}`,
            role: "assistant" as const,
            content: item.response,
            timestamp: new Date(item.created_at),
          },
        ]);
        setMessages([INITIAL_MESSAGE, ...historyMessages]);
      } finally {
        setHistoryLoaded(true);
      }
    }
    loadHistory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  async function handleClearHistory() {
    const token = getToken();
    if (!token) return;
    await fetch(`${baseApi}/auth/v1/chat/history`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setMessages([INITIAL_MESSAGE]);
  }

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch(`${baseApi}/auth/v1/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ message: trimmed }),
      });

      if (response.status === 503) {
        const body = await response.json().catch(() => null);
        const content =
          body?.reason === "overloaded"
            ? "The AI assistant is receiving a high volume of requests right now. Please try again in a moment."
            : "AI assistant is currently unavailable. Please try again later.";
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content,
            timestamp: new Date(),
          },
        ]);
        return;
      }

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const { reply }: { reply: string } = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: reply,
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Something went wrong while reaching the AI assistant. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const showClearButton = historyLoaded && messages.length > 1;

  return (
    <Card className="flex flex-col w-full h-[700px]">
      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        {showClearButton && (
          <div className="flex justify-end px-4 pt-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive gap-1"
              onClick={handleClearHistory}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear history
            </Button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8 shrink-0 bg-primary text-primary-foreground flex items-center justify-center">
                  <Sparkles className="h-4 w-4" />
                </Avatar>
              )}
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground border border-border"
                }`}
              >
                <p className="text-sm leading-relaxed text-pretty">
                  {message.content}
                </p>
                <p
                  className={`text-xs mt-2 ${
                    message.role === "user"
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {message.role === "user" && (
                <Avatar className="h-8 w-8 shrink-0 bg-secondary text-secondary-foreground flex items-center justify-center font-semibold text-sm">
                  Me
                </Avatar>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 shrink-0 bg-primary text-primary-foreground flex items-center justify-center">
                <Sparkles className="h-4 w-4" />
              </Avatar>
              <div className="bg-muted rounded-lg px-4 py-3 border border-border">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {messages.length === 1 && (
          <div className="px-4 pb-4">
            <p className="text-sm font-medium text-muted-foreground mb-3">
              Suggested Questions:
            </p>
            <div className="grid gap-2">
              {SUGGESTED_QUESTIONS.map((question) => (
                <Button
                  key={question}
                  variant="outline"
                  size="sm"
                  className="justify-start text-left h-auto py-2 px-3 text-sm bg-transparent"
                  onClick={() => setInput(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Ask me anything about your finances..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button
              onClick={handleSend}
              size="icon"
              disabled={!input.trim() || isTyping}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            This AI coach analyzes your financial data to provide personalized
            advice.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
