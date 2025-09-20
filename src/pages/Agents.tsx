import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Bot, Plus, Settings, Users, FileText, Brain, Search, HeadphonesIcon } from "lucide-react";
import { useState } from "react";
import { JiraIcon } from "@/components/icons/JiraIcon";
import { ConfluenceIcon } from "@/components/icons/ConfluenceIcon";
import { NotionIcon } from "@/components/icons/NotionIcon";

const presetAgents = [
  {
    id: "customer-insights",
    name: "Customer Insights",
    description: "Provides detailed customer analysis and support insights",
    tone: "Professional and empathetic",
    sources: [
      { name: "Jira", icon: JiraIcon, enabled: true },
      { name: "Confluence", icon: ConfluenceIcon, enabled: true },
      { name: "Notion", icon: NotionIcon, enabled: false }
    ],
    status: "Active",
    icon: Users,
    color: "bg-blue-500"
  },
  {
    id: "technical-support",
    name: "Technical Support",
    description: "Handles technical queries and troubleshooting",
    tone: "Clear and solution-focused", 
    sources: [
      { name: "Confluence", icon: ConfluenceIcon, enabled: true },
      { name: "Jira", icon: JiraIcon, enabled: true },
      { name: "Notion", icon: NotionIcon, enabled: true }
    ],
    status: "Active",
    icon: Settings,
    color: "bg-green-500"
  },
  {
    id: "sales-assistant",
    name: "Sales Assistant",
    description: "Supports sales processes and lead qualification",
    tone: "Engaging and persuasive",
    sources: [
      { name: "Notion", icon: NotionIcon, enabled: true },
      { name: "Confluence", icon: ConfluenceIcon, enabled: false }
    ],
    status: "Draft",
    icon: Search,
    color: "bg-orange-500"
  },
  {
    id: "content-creator",
    name: "Content Creator",
    description: "Generates marketing content and documentation",
    tone: "Creative and brand-aligned",
    sources: [
      { name: "Notion", icon: NotionIcon, enabled: true },
      { name: "Confluence", icon: ConfluenceIcon, enabled: true }
    ],
    status: "Active", 
    icon: FileText,
    color: "bg-purple-500"
  }
];

export const Agents = () => {
  const [selectedAgent, setSelectedAgent] = useState(presetAgents[0]);
  const [agents, setAgents] = useState(presetAgents);

  const toggleSource = (agentId: string, sourceIndex: number) => {
    setAgents(prevAgents => 
      prevAgents.map(agent => 
        agent.id === agentId 
          ? {
              ...agent,
              sources: agent.sources.map((source, index) => 
                index === sourceIndex 
                  ? { ...source, enabled: !source.enabled }
                  : source
              )
            }
          : agent
      )
    );
    
    // Update selected agent if it's the one being modified
    if (selectedAgent.id === agentId) {
      setSelectedAgent(prevSelected => ({
        ...prevSelected,
        sources: prevSelected.sources.map((source, index) => 
          index === sourceIndex 
            ? { ...source, enabled: !source.enabled }
            : source
        )
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Bot className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Knowledge Agents</h1>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Agent
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agents List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Agents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {presetAgents.map((agent) => {
                  const IconComponent = agent.icon;
                  return (
                    <div
                      key={agent.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                        selectedAgent.id === agent.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedAgent(agent)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-md ${agent.color} text-white`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-sm truncate">{agent.name}</h3>
                            <Badge variant={agent.status === 'Active' ? 'default' : 'secondary'} className="text-xs">
                              {agent.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {agent.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {/* Create New Agent Card */}
                <div className="p-3 rounded-lg border-2 border-dashed border-primary/30 hover:border-primary/50 cursor-pointer transition-all hover:bg-primary/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-primary/10 text-primary">
                      <Plus className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-primary">Create New Agent</h3>
                      <p className="text-xs text-muted-foreground">Build a custom agent</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Agent Configuration */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-md ${selectedAgent.color} text-white`}>
                    <selectedAgent.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>{selectedAgent.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{selectedAgent.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="behavior" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="behavior" className="flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      Behavior
                    </TabsTrigger>
                    <TabsTrigger value="sources" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Sources
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="behavior" className="space-y-4 mt-6">
                    <div>
                      <label className="text-sm font-medium">Tone</label>
                      <p className="text-sm text-muted-foreground mb-2">
                        Sets the communication style for all responses
                      </p>
                      <div className="p-3 bg-muted rounded-md">
                        <p className="text-sm">{selectedAgent.tone}</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Prompt</label>
                      <p className="text-sm text-muted-foreground mb-2">
                        Define the agent's role and capabilities
                      </p>
                      <div className="p-3 bg-muted rounded-md space-y-2">
                        <div>
                          <span className="text-xs font-medium text-muted-foreground"># Role</span>
                          <p className="text-sm">You are a helpful {selectedAgent.name.toLowerCase()} that provides detailed and informative responses.</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-muted-foreground"># Context</span>
                          <p className="text-sm">You have access to comprehensive data and should provide accurate, relevant information.</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-muted-foreground"># Format</span>
                          <p className="text-sm">Organize responses clearly with helpful formatting and actionable insights.</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="sources" className="space-y-4 mt-6">
                    <div>
                      <label className="text-sm font-medium">Connected Sources</label>
                      <p className="text-sm text-muted-foreground mb-3">
                        Data sources this agent can reference
                      </p>
                      <div className="space-y-2">
                        {selectedAgent.sources.map((source, index) => {
                          const SourceIcon = source.icon;
                          return (
                            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                              <div className="flex items-center gap-3">
                                <SourceIcon className="h-5 w-5" />
                                <span className="text-sm font-medium">{source.name}</span>
                              </div>
                              <Switch 
                                checked={source.enabled}
                                onCheckedChange={() => toggleSource(selectedAgent.id, index)} 
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};