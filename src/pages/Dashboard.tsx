import { Header } from "@/components/Layout/Header";
import { IntegrationCard } from "@/components/Dashboard/IntegrationCard";
import { ChatInterface } from "@/components/Chat/ChatInterface";
import { MultiAgentChatInterface } from "@/components/Chat/MultiAgentChatInterface";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AtSign, 
  FileText, 
  Code2, 
  TrendingUp, 
  Users, 
  Clock, 
  MessageSquare,
  Zap,
  Bot
} from "lucide-react";

export const Dashboard = () => {
  const integrations = [
    {
      name: "Jira",
      description: "Issues, epics, and project tracking",
      status: "connected" as const,
      lastSync: "2 minutes ago",
      itemCount: 1247,
      icon: <AtSign className="h-5 w-5 text-accent-foreground" />
    },
    {
      name: "Confluence", 
      description: "Documentation and knowledge pages",
      status: "connected" as const,
      lastSync: "5 minutes ago",
      itemCount: 892,
      icon: <FileText className="h-5 w-5 text-accent-foreground" />
    },
    {
      name: "Code Repository",
      description: "Source code and documentation",
      status: "connected" as const,
      lastSync: "1 minute ago", 
      itemCount: 3456,
      icon: <Code2 className="h-5 w-5 text-accent-foreground" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <div className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-light rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">5,595</p>
                <p className="text-sm text-muted-foreground">Total Items Indexed</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Users className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">24</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <MessageSquare className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">847</p>
                <p className="text-sm text-muted-foreground">Queries Today</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-accent rounded-lg">
                <Clock className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">1.2s</p>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Integrations */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Integrations</h2>
              <Button size="sm" variant="outline">
                <Zap className="h-4 w-4 mr-2" />
                Add Integration
              </Button>
            </div>
            
            <div className="space-y-4">
              {integrations.map((integration, index) => (
                <IntegrationCard key={index} {...integration} />
              ))}
            </div>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="font-semibold text-card-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="ghost" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-3" />
                  Sync All Integrations
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-3" />
                  Manage Team Access
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-3" />
                  View Analytics
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column - Chat Interfaces */}
          <div className="lg:col-span-2">
            <Card className="h-[700px] flex flex-col">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-card-foreground">AI Assistant Suite</h2>
                    <p className="text-muted-foreground">Choose between single or multi-agent responses</p>
                  </div>
                  <Badge className="bg-success text-success-foreground">
                    AI Ready
                  </Badge>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <Tabs defaultValue="single" className="h-full flex flex-col">
                  <TabsList className="grid w-full grid-cols-2 mx-6 mt-4">
                    <TabsTrigger value="single" className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>Single Agent</span>
                    </TabsTrigger>
                    <TabsTrigger value="team" className="flex items-center space-x-2">
                      <Bot className="h-4 w-4" />
                      <span>Team Chat</span>
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="single" className="flex-1 mt-0">
                    <ChatInterface />
                  </TabsContent>
                  <TabsContent value="team" className="flex-1 mt-0">
                    <MultiAgentChatInterface />
                  </TabsContent>
                </Tabs>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};