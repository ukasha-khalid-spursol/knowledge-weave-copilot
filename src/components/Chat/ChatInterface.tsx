import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Send, Loader2, FileText, Bug, Code2, ExternalLink, Bot, Users, Settings, Search, ChevronDown, Star } from "lucide-react";
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

const availableAgents = [
  {
    id: "customer-insights",
    name: "Customer Insights",
    description: "Provides detailed customer analysis and support insights",
    icon: Users,
    color: "bg-blue-500"
  },
  {
    id: "technical-support",
    name: "Technical Support", 
    description: "Handles technical queries and troubleshooting",
    icon: Settings,
    color: "bg-green-500"
  },
  {
    id: "sales-assistant",
    name: "Sales Assistant",
    description: "Supports sales processes and lead qualification", 
    icon: Search,
    color: "bg-orange-500"
  },
  {
    id: "content-creator",
    name: "Content Creator",
    description: "Generates marketing content and documentation",
    icon: FileText,
    color: "bg-purple-500"
  }
];

export const ChatInterface = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string>(availableAgents[0].id);
  const [defaultAgent, setDefaultAgent] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    const inputText = input;
    setInput("");
    setIsLoading(true);

    // Add typing indicator message
    const typingMessage: ChatMessage = {
      id: "typing-" + Date.now().toString(),
      role: "assistant",
      content: "typing...",
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      const response = await fetch("https://concern-talks-operations-meetup.trycloudflare.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          message: inputText,
          agent: selectedAgent 
        }),
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

      // Remove typing indicator and add real response
      setMessages(prev => prev.filter(msg => !msg.id.startsWith("typing-")).concat([assistantMessage]));
    } catch (error) {
      // Remove typing indicator on error
      setMessages(prev => prev.filter(msg => !msg.id.startsWith("typing-")));
      toast({
        title: "Error",
        description: "Failed to get response from the backend. Make sure your API is running.",
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

  const preloadedQuestions = [];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-hidden">
          {/* Agent Selection */}
          <div className="w-full max-w-lg">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-foreground mb-2 tracking-tight">Choose Your Knowledge Agent</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Select an AI specialist for your query</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {availableAgents.map((agent) => {
                const IconComponent = agent.icon;
                const isSelected = selectedAgent === agent.id;
                return (
                  <Card
                    key={agent.id}
                    className={`group p-5 cursor-pointer transition-all duration-200 border-2 hover:shadow-lg ${
                      isSelected 
                        ? 'border-primary bg-primary/5 shadow-md ring-1 ring-primary/20' 
                        : 'border-border hover:border-primary/40 hover:shadow-md hover:bg-card/50'
                    }`}
                    onClick={() => setSelectedAgent(agent.id)}
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className={`p-4 rounded-xl ${agent.color} text-white shadow-sm group-hover:shadow-md transition-shadow`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-semibold text-sm text-foreground">{agent.name}</div>
                        <div className="text-xs text-muted-foreground leading-relaxed line-clamp-2 px-1">
                          {agent.description}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="max-w-full">
            {messages.map((message) => (
              <div key={message.id} className="space-y-3 mb-4">
                <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`w-full max-w-[85%] rounded-lg p-4 ${
                    message.role === "user" 
                      ? "bg-primary/10 text-foreground border border-primary/20" 
                      : "bg-muted/40 text-card-foreground shadow-sm border"
                  }`}>
                    <div className="prose prose-sm max-w-none">
                      {message.content === "typing..." ? (
                        <div className="flex items-center space-x-1">
                          <span className="text-muted-foreground">Agent is thinking</span>
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </div>
                      ) : (
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={markdownComponents}
                        >
                          {message.content}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                </div>
                
                {message.sources && message.sources.length > 0 && (
                  <div className="w-full max-w-[85%] ml-auto">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Sources:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {message.sources.map((source, index) => (
                        <Card key={index} className="p-3 hover:bg-card-hover transition-colors cursor-pointer">
                          <div className="flex items-center space-x-2">
                            {getSourceIcon(source.type)}
                            <span className="flex-1 text-sm font-medium text-card-foreground truncate">{source.title}</span>
                            <Badge variant="secondary" className="text-xs flex-shrink-0">
                              {source.type.toUpperCase()}
                            </Badge>
                            <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t border-border bg-background flex-shrink-0">
        <div className="flex space-x-4 items-center">
          {/* Agent Selection Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-3 px-4 py-3 bg-muted/20 rounded-xl border border-muted-foreground/5 hover:bg-muted/30 h-auto">
                {(() => {
                  const agent = availableAgents.find(a => a.id === selectedAgent) || availableAgents[0];
                  const IconComponent = agent.icon;
                  return (
                    <>
                      <div className={`p-2 rounded-lg ${agent.color} text-white shadow-sm`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{agent.name}</span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </>
                  );
                })()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 bg-background/95 backdrop-blur-sm border border-border/50">
              <DropdownMenuLabel>Select Agent</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {availableAgents.map((agent) => {
                const IconComponent = agent.icon;
                return (
                  <DropdownMenuItem 
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent.id)}
                    className="flex items-center space-x-3 p-3 cursor-pointer"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${agent.color} text-white shadow-sm`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{agent.name}</span>
                        {defaultAgent === agent.id && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                      </div>
                      <p className="text-xs text-muted-foreground">{agent.description}</p>
                    </div>
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setDefaultAgent(selectedAgent)}
                className="flex items-center space-x-2 p-2 cursor-pointer text-sm text-muted-foreground"
              >
                <Star className="h-4 w-4" />
                <span>Set as Default</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
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