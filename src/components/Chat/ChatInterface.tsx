import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Loader2, FileText, Bug, Code2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Array<{
    title: string;
    type: "jira" | "confluence" | "code";
    url: string;
  }>;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        sources: [
          {
            title: "JIRA-123: Authentication Implementation",
            type: "jira",
            url: "#"
          },
          {
            title: "OAuth Setup Guide",
            type: "confluence",
            url: "#"
          }
        ]
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from the backend. Make sure your API is running on localhost:8080",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case "jira":
        return <Bug className="h-4 w-4" />;
      case "confluence":
        return <FileText className="h-4 w-4" />;
      case "code":
        return <Code2 className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const markdownComponents = {
    img: ({ src, alt, ...props }: any) => (
      <img
        src={src}
        alt={alt}
        {...props}
        className="rounded-lg max-w-full h-auto my-2 shadow-sm"
        style={{ maxWidth: '200px', height: 'auto' }}
      />
    ),
    h1: ({ children, ...props }: any) => (
      <h1 className="text-xl font-bold text-card-foreground mb-2" {...props}>{children}</h1>
    ),
    h2: ({ children, ...props }: any) => (
      <h2 className="text-lg font-semibold text-card-foreground mb-2" {...props}>{children}</h2>
    ),
    h3: ({ children, ...props }: any) => (
      <h3 className="text-md font-medium text-card-foreground mb-1" {...props}>{children}</h3>
    ),
    p: ({ children, ...props }: any) => (
      <p className="text-card-foreground mb-2" {...props}>{children}</p>
    ),
    ul: ({ children, ...props }: any) => (
      <ul className="list-disc pl-6 mb-2 text-card-foreground" {...props}>{children}</ul>
    ),
    ol: ({ children, ...props }: any) => (
      <ol className="list-decimal pl-6 mb-2 text-card-foreground" {...props}>{children}</ol>
    ),
    li: ({ children, ...props }: any) => (
      <li className="mb-1 text-card-foreground" {...props}>{children}</li>
    ),
    strong: ({ children, ...props }: any) => (
      <strong className="font-semibold text-card-foreground" {...props}>{children}</strong>
    ),
    code: ({ children, ...props }: any) => (
      <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono text-card-foreground" {...props}>{children}</code>
    ),
    pre: ({ children, ...props }: any) => (
      <pre className="bg-muted p-3 rounded-lg overflow-x-auto mb-2" {...props}>{children}</pre>
    )
  };

  const preloadedQuestions = [
    "How do I set up local development environment?",
    "What's blocking the Q1 release?",
    "Where is OAuth handled in the repository?",
    "Show me recent critical bugs in Jira"
  ];

  return (
    <div className="flex flex-col h-full">
      {messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Ask Your Knowledge Base</h2>
            <p className="text-muted-foreground">Get instant answers from Jira, Confluence, and your codebase</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
            {preloadedQuestions.map((question, index) => (
              <Card 
                key={index}
                className="p-4 cursor-pointer hover:shadow-card transition-all hover:bg-card-hover"
                onClick={() => setInput(question)}
              >
                <p className="text-sm text-card-foreground">{question}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div key={message.id} className="space-y-4">
              <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-3xl rounded-lg p-4 ${
                  message.role === "user" 
                    ? "bg-gradient-primary text-primary-foreground ml-12" 
                    : "bg-card text-card-foreground mr-12 shadow-card"
                }`}>
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={markdownComponents}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
              
              {message.sources && message.sources.length > 0 && (
                <div className="mr-12">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Sources:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {message.sources.map((source, index) => (
                      <Card key={index} className="p-3 hover:bg-card-hover transition-colors cursor-pointer">
                        <div className="flex items-center space-x-2">
                          {getSourceIcon(source.type)}
                          <span className="flex-1 text-sm font-medium text-card-foreground">{source.title}</span>
                          <Badge variant="secondary" className="text-xs">
                            {source.type.toUpperCase()}
                          </Badge>
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="p-6 border-t border-border bg-background">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSend()}
            placeholder="Ask about your integrations, code, or processes..."
            className="flex-1 p-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isLoading}
            className="px-6"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};