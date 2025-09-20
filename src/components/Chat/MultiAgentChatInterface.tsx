import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Loader2, AtSign, FileText, Users, ExternalLink, Settings, Search } from "lucide-react";
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

export const MultiAgentChatInterface = () => {
  const [messages, setMessages] = useState<MultiAgentMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string>(availableAgents[0].id);
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
      const response = await fetch("https://concern-talks-operations-meetup.trycloudflare.com/team_chat", {
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
      
      const assistantMessage: MultiAgentMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Team analysis completed",
        agentResponses: data.responses,
        sources: data.sources
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
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-foreground mb-2">Choose Your Knowledge Agent</h3>
              <p className="text-sm text-muted-foreground">Select an AI specialist for your query</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {availableAgents.map((agent) => {
                const IconComponent = agent.icon;
                const isSelected = selectedAgent === agent.id;
                return (
                  <Card
                    key={agent.id}
                    className={`p-4 cursor-pointer transition-all border-2 ${
                      isSelected 
                        ? 'border-primary bg-primary/5 shadow-md' 
                        : 'border-border hover:border-primary/50 hover:shadow-sm'
                    }`}
                    onClick={() => setSelectedAgent(agent.id)}
                  >
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className={`p-3 rounded-lg ${agent.color} text-white`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{agent.name}</div>
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
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
                      ? "bg-gradient-primary text-primary-foreground" 
                      : "bg-card text-card-foreground shadow-card"
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
                                  <Card className="p-4 border-l-4 bg-gradient-subtle border-primary">
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
          {/* Selected Agent Indicator */}
          <div className="flex items-center space-x-2 px-3 py-2 bg-muted rounded-lg border">
            {(() => {
              const agent = availableAgents.find(a => a.id === selectedAgent) || availableAgents[0];
              const IconComponent = agent.icon;
              return (
                <>
                  <div className={`p-1.5 rounded-md ${agent.color} text-white`}>
                    <IconComponent className="h-3 w-3" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{agent.name}</span>
                </>
              );
            })()}
          </div>
          
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