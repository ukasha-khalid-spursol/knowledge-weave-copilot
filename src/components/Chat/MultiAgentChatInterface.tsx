import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Send, Loader2, AtSign, FileText, Users, ExternalLink, Settings, Search, ChevronDown, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AgentResponse {
  team?: string;
}

interface SourceInfo {
  agent: string;
  sources: string[];
}

interface MultiAgentMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  agentResponses?: AgentResponse;
  sources?: SourceInfo[];
}

const availableAgents = [
  {
    id: "customer-insights",
    agentId: 1,
    name: "Customer Insights",
    description: "Provides detailed customer analysis and support insights",
    icon: Users,
    color: "bg-blue-500"
  },
  {
    id: "technical-support",
    agentId: 2,
    name: "Technical Support", 
    description: "Handles technical queries and troubleshooting",
    icon: Settings,
    color: "bg-green-500"
  },
  {
    id: "sales-assistant",
    agentId: 3,
    name: "Sales Assistant",
    description: "Supports sales processes and lead qualification",
    icon: Search,
    color: "bg-orange-500"
  },
  {
    id: "content-creator",
    agentId: 4,
    name: "Content Creator",
    description: "Generates marketing content and documentation",
    icon: FileText,
    color: "bg-purple-500"
  }
];

export const MultiAgentChatInterface = () => {
  const [messages, setMessages] = useState<MultiAgentMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string>("general");
  const { toast } = useToast();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: MultiAgentMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    const inputText = input;
    setInput("");
    setIsLoading(true);

    // Add typing indicator message
    const typingMessage: MultiAgentMessage = {
      id: "typing-" + Date.now().toString(),
      role: "assistant",
      content: "typing...",
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      let url = "https://concern-talks-operations-meetup.trycloudflare.com/chat";
      let requestBody: any = { message: inputText };

      // If general assistant is selected, use /chat
      if (selectedAgent === "general") {
        url = "https://concern-talks-operations-meetup.trycloudflare.com/chat";
      }
      // If team chat is selected, use /team_chat
      else if (selectedAgent === "team") {
        url = "https://concern-talks-operations-meetup.trycloudflare.com/team_chat";
      }
      // If a specific agent is selected, use /chat_agent with agent ID
      else {
        const agent = availableAgents.find(a => a.id === selectedAgent);
        if (agent) {
          url = `https://concern-talks-operations-meetup.trycloudflare.com/chat_agent?id=${agent.agentId}`;
        }
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      
      const assistantMessage: MultiAgentMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: selectedAgent === "team" ? "Team analysis completed" : data.response,
        agentResponses: selectedAgent === "team" ? data.responses : undefined,
        sources: selectedAgent === "team" ? data.sources : undefined
      };

      // Remove typing indicator and add real response
      setMessages(prev => prev.filter(msg => !msg.id.startsWith("typing-")).concat([assistantMessage]));
    } catch (error) {
      // Remove typing indicator on error
      setMessages(prev => prev.filter(msg => !msg.id.startsWith("typing-")));
      toast({
        title: "Error",
        description: "Failed to get response from the team chat API. Make sure your API is running.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAgentIcon = (agent: string) => {
    switch (agent.toLowerCase()) {
      case "jira":
        return <AtSign className="h-4 w-4" />;
      case "notion":
        return <FileText className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getAgentColor = (agent: string) => {
    switch (agent.toLowerCase()) {
      case "jira":
        return "bg-blue-50 border-blue-200 text-blue-700";
      case "notion":
        return "bg-gray-50 border-gray-200 text-gray-700";
      default:
        return "bg-purple-50 border-purple-200 text-purple-700";
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
      <h1 className="text-lg font-bold text-card-foreground mb-2" {...props}>{children}</h1>
    ),
    h2: ({ children, ...props }: any) => (
      <h2 className="text-md font-semibold text-card-foreground mb-2" {...props}>{children}</h2>
    ),
    p: ({ children, ...props }: any) => (
      <p className="text-card-foreground mb-2 text-sm" {...props}>{children}</p>
    ),
    ul: ({ children, ...props }: any) => (
      <ul className="list-disc pl-4 mb-2 text-card-foreground text-sm" {...props}>{children}</ul>
    ),
    code: ({ children, ...props }: any) => (
      <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono text-card-foreground" {...props}>{children}</code>
    ),
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
          <div className="max-w-full mx-auto" style={{ maxWidth: 'calc(100% - 2rem)' }}>
            {messages.map((message) => (
              <div key={message.id} className="space-y-3 mb-4 max-w-full">
                <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-lg p-4 ${
                    message.role === "user" 
                      ? "bg-primary/10 text-foreground border border-primary/20" 
                      : "bg-muted/40 text-card-foreground shadow-sm border"
                  }`}>
                    {message.role === "user" ? (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    ) : (
                      <div className="space-y-4">
                        {message.content === "typing..." ? (
                          <div className="flex items-center space-x-1 p-4">
                            <span className="text-muted-foreground">Team is analyzing</span>
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                          </div>
                        ) : (
                          <>
                            {message.agentResponses && (
                              <div className="space-y-4">
                                {message.agentResponses.team ? (
                                  <Card className="p-4 border-l-4 bg-muted/20 border-primary shadow-sm">
                                    <div className="flex items-center space-x-2 mb-3">
                                      <Users className="h-4 w-4" />
                                      <Badge variant="secondary" className="text-xs font-medium">
                                        TEAM RESPONSE
                                      </Badge>
                                    </div>
                                    <div className="prose prose-sm max-w-none">
                                      <ReactMarkdown 
                                        remarkPlugins={[remarkGfm]}
                                        components={markdownComponents}
                                      >
                                        {message.agentResponses.team}
                                      </ReactMarkdown>
                                    </div>
                                  </Card>
                                ) : (
                                  <p className="text-muted-foreground">No team response available</p>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {message.sources && message.sources.length > 0 && (
                  <div className={`max-w-[85%] ${message.role === "user" ? "ml-auto" : "mr-auto"}`}>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Sources by Agent:</h4>
                    <div className="space-y-3">
                      {message.sources.map((sourceInfo, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center space-x-2">
                            {getAgentIcon(sourceInfo.agent)}
                            <Badge variant="outline" className="text-xs">
                              {sourceInfo.agent.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 gap-2 pl-6">
                            {sourceInfo.sources.map((source, sourceIndex) => (
                              <Card key={sourceIndex} className="p-2 hover:bg-card-hover transition-colors cursor-pointer">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-card-foreground truncate flex-1 mr-2">{source}</span>
                                  <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
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
                  if (selectedAgent === "general") {
                    return (
                      <>
                        <div className="p-2 rounded-lg bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-sm">
                          <Bot className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-foreground">General Assistant</span>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </>
                    );
                  } else if (selectedAgent === "team") {
                    return (
                      <>
                        <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-sm">
                          <Users className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-foreground">Team Chat</span>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </>
                    );
                  } else {
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
                  }
                })()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 bg-background/95 backdrop-blur-sm border border-border/50">
              <DropdownMenuLabel>Select Assistant Mode</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setSelectedAgent("general")}
                className="flex items-center space-x-3 p-3 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-sm">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium">General Assistant</span>
                  <p className="text-xs text-muted-foreground">Standard responses without specialized tone</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSelectedAgent("team")}
                className="flex items-center space-x-3 p-3 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-sm">
                  <Users className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium">Team Chat</span>
                  <p className="text-xs text-muted-foreground">Get responses from all available agents</p>
                </div>
              </DropdownMenuItem>
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
                      <span className="text-sm font-medium">{agent.name}</span>
                      <p className="text-xs text-muted-foreground">{agent.description}</p>
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSend()}
            placeholder="Ask your team of AI agents about your integrations..."
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