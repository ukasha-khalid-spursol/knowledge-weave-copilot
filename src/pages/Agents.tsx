import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
    prompt: "You are a helpful customer insights agent that provides detailed and informative responses about customer behavior and support patterns.",
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
    prompt: "You are a helpful technical support agent that provides detailed and informative responses for troubleshooting and technical queries.",
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
    prompt: "You are a helpful sales assistant that provides detailed and informative responses to support sales processes and lead qualification.",
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
    tone: "Creative + Conversational + Adaptive + Engaging + Empowering.",
    prompt: "As a content creator, your role is to act as a knowledgeable strategist and educator who transforms raw data into clear, engaging, and actionable content. You are responsible for generating accurate and relevant material, structuring responses for clarity, and delivering insights that connect information to real-world applications. You should adapt your style to the medium, ensure consistency in tone and quality, and always highlight key takeaways that empower the reader to act.",
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
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newAgent, setNewAgent] = useState({
    name: "",
    tone: "",
    prompt: "",
    sources: {
      jira: false,
      confluence: false,
      notion: false
    }
  });

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
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create New Agent
              </Button>
            </DialogTrigger>
          </Dialog>
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
                          <h3 className="font-medium text-sm truncate">{agent.name}</h3>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {agent.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {/* Create New Agent Card */}
                <div 
                  className="p-3 rounded-lg border-2 border-dashed border-primary/30 hover:border-primary/50 cursor-pointer transition-all hover:bg-primary/5"
                  onClick={() => setIsCreateDialogOpen(true)}
                >
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
                      <div className="p-3 bg-muted rounded-md">
                        <p className="text-sm">{selectedAgent.prompt}</p>
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

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create New Agent</DialogTitle>
              <DialogDescription>
                Configure your new knowledge agent with behavior and data sources.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Agent Name</Label>
                <Input
                  id="name"
                  value={newAgent.name}
                  onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                  placeholder="Enter agent name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="prompt">Agent Prompt</Label>
                <Textarea
                  id="prompt"
                  value={newAgent.prompt}
                  onChange={(e) => setNewAgent({ ...newAgent, prompt: e.target.value })}
                  placeholder="Define the agent's role, capabilities and behavior"
                  rows={4}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tone">Communication Tone</Label>
                <Input
                  id="tone"
                  value={newAgent.tone}
                  onChange={(e) => setNewAgent({ ...newAgent, tone: e.target.value })}
                  placeholder="e.g., Professional and helpful"
                />
              </div>
              <div className="grid gap-3">
                <Label>Data Sources</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <div className="flex items-center gap-3">
                      <JiraIcon className="h-5 w-5" />
                      <span className="text-sm font-medium">Jira</span>
                    </div>
                    <Switch
                      checked={newAgent.sources.jira}
                      onCheckedChange={(checked) => 
                        setNewAgent({ 
                          ...newAgent, 
                          sources: { ...newAgent.sources, jira: checked } 
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <div className="flex items-center gap-3">
                      <ConfluenceIcon className="h-5 w-5" />
                      <span className="text-sm font-medium">Confluence</span>
                    </div>
                    <Switch
                      checked={newAgent.sources.confluence}
                      onCheckedChange={(checked) => 
                        setNewAgent({ 
                          ...newAgent, 
                          sources: { ...newAgent.sources, confluence: checked } 
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <div className="flex items-center gap-3">
                      <NotionIcon className="h-5 w-5" />
                      <span className="text-sm font-medium">Notion</span>
                    </div>
                    <Switch
                      checked={newAgent.sources.notion}
                      onCheckedChange={(checked) => 
                        setNewAgent({ 
                          ...newAgent, 
                          sources: { ...newAgent.sources, notion: checked } 
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                // Handle agent creation here
                setIsCreateDialogOpen(false);
                setNewAgent({
                  name: "",
                  tone: "",
                  prompt: "",
                  sources: { jira: false, confluence: false, notion: false }
                });
              }}>
                Create Agent
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
};