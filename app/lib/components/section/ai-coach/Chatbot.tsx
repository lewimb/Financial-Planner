"use client";

import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { Avatar } from "~/components/ui/avatar";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content:
      "Hello! I'm your AI Financial Coach. I'm here to help you make smarter financial decisions, answer your money questions, and provide personalized guidance based on your financial data. How can I assist you today?",
    timestamp: new Date(),
  },
];

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: getAIResponse(input),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <Card className="h-full flex flex-col w-fit">
      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        {/* Messages Area */}
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
                  JD
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
        </div>

        {/* Suggested Questions (shown when no user messages yet) */}
        {messages.length === 1 && (
          <div className="px-4 pb-4">
            <p className="text-sm font-medium text-muted-foreground mb-3">
              Suggested Questions:
            </p>
            <div className="grid gap-2">
              {[
                "How can I reduce my monthly expenses?",
                "Am I on track to meet my emergency fund goal?",
                "What percentage of my income should I save?",
                "How can I improve my spending habits?",
              ].map((question) => (
                <Button
                  key={question}
                  variant="outline"
                  size="sm"
                  className="justify-start text-left h-auto py-2 px-3 text-sm bg-transparent"
                  onClick={() => handleSuggestedQuestion(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask me anything about your finances..."
              className="flex-1"
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

function getAIResponse(userInput: string): string {
  const input = userInput.toLowerCase();

  if (
    input.includes("expense") ||
    input.includes("spending") ||
    input.includes("reduce")
  ) {
    return "Based on your spending patterns, I notice that Food & Dining makes up about 22% of your monthly expenses at $520. Here are some strategies to reduce costs:\n\n1. Try meal planning and cooking at home more often - this could save you $100-150/month\n2. Look for subscription services you're not using - I see you have Netflix and two other streaming services\n3. Consider carpooling or using public transit to reduce transportation costs\n\nWould you like me to help you create a more detailed savings plan?";
  }

  if (
    input.includes("goal") ||
    input.includes("emergency fund") ||
    input.includes("track")
  ) {
    return "Great question! Your Emergency Fund goal is looking strong. You currently have $8,200 saved toward your $10,000 target, which means you're 82% of the way there!\n\nAt your current monthly contribution rate of $400, you'll reach your goal in approximately 5 months. However, if you can increase your monthly contribution to $500, you could reach it 1.5 months sooner.\n\nYou're ahead of the typical recommendation of 3-6 months of expenses. Keep up the excellent work!";
  }

  if (
    input.includes("save") ||
    input.includes("percentage") ||
    input.includes("income")
  ) {
    return "The 50/30/20 rule is a great guideline for budgeting:\n\n• 50% for needs (housing, utilities, groceries, insurance)\n• 30% for wants (dining out, entertainment, hobbies)\n• 20% for savings and debt repayment\n\nBased on your income of $5,420/month, you should aim to save about $1,084/month. Currently, you're saving about $750/month (14%), so there's room to increase your savings rate.\n\nWould you like suggestions on where to find that extra 6%?";
  }

  if (
    input.includes("habit") ||
    input.includes("improve") ||
    input.includes("better")
  ) {
    return "I've analyzed your spending patterns and have some insights:\n\n✓ Strengths:\n• You're consistently saving toward your goals\n• Your fixed expenses (rent, utilities) are well-managed\n• You rarely make impulsive large purchases\n\n⚠ Areas for improvement:\n• Food delivery appears 12 times this month - consider cooking more\n• Your Entertainment spending increased 15% vs last month\n• You have 3 active subscription services you rarely use\n\nSmall changes in these areas could save you $200-300/month. Would you like specific action steps?";
  }

  return "That's an interesting question! Based on your financial profile, I can provide personalized guidance. Your current financial health shows:\n\n• Total Balance: $24,580 (up 12.5% from last month)\n• Monthly Savings Rate: 14% of income\n• Active Goals: 5 (all making progress)\n• Budget Compliance: 68% of budget used this month\n\nCould you provide more specific details about what you'd like to know? I'm here to help with budgeting, saving strategies, goal planning, or any other financial questions.";
}
