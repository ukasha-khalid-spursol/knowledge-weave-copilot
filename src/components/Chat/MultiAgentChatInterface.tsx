import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Loader2, AtSign, FileText, Users, ExternalLink } from "lucide-react";
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

export const MultiAgentChatInterface = () => {
  const [messages, setMessages] = useState<MultiAgentMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: MultiAgentMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/team_chat", {
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
      
      const assistantMessage: MultiAgentMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Team analysis completed",
        agentResponses: data.responses,
        sources: data.sources
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from the team chat API. Make sure your API is running on localhost:8080",
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

  const preloadedQuestions = [
    "What are the current blockers across all systems?",
    "Show me recent updates from Jira and Notion",
    "What documentation exists for our authentication flow?",
    "Team chat: analyze project status across platforms"
  ];

  return (
    <div className="flex flex-col h-full">
      {messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Multi-Agent Team Chat</h2>
            <p className="text-muted-foreground">Get coordinated insights from all your integrated platforms</p>
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
                <div className={`max-w-4xl rounded-lg p-4 ${
                  message.role === "user" 
                    ? "bg-gradient-primary text-primary-foreground ml-12" 
                    : "bg-card text-card-foreground mr-12 shadow-card"
                }`}>
                  {message.role === "user" ? (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  ) : (
                    <div className="space-y-4">
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
                    </div>
                  )}
                </div>
              </div>
              
              {message.sources && message.sources.length > 0 && (
                <div className="mr-12">
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
                                <span className="text-xs text-card-foreground truncate">{source}</span>
                                <ExternalLink className="h-3 w-3 text-muted-foreground" />
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
      )}

      <div className="p-6 border-t border-border bg-background">
        <div className="flex space-x-4">
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