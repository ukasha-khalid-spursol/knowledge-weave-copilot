import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Database } from "lucide-react";
import { JiraIcon } from "@/components/icons/JiraIcon";
import { ConfluenceIcon } from "@/components/icons/ConfluenceIcon";
import { NotionIcon } from "@/components/icons/NotionIcon";

const sources = [
  {
    id: "jira",
    name: "Jira",
    icon: JiraIcon,
    description: "Project management and issue tracking",
    connected: true,
  },
  {
    id: "confluence",
    name: "Confluence",
    icon: ConfluenceIcon,
    description: "Team collaboration and documentation",
    connected: false,
  },
  {
    id: "notion",
    name: "Notion",
    icon: NotionIcon,
    description: "All-in-one workspace for notes and docs",
    connected: true,
  },
];

export const Sources = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <Database className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Search Sources</h1>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search sources..." 
            className="pl-10 max-w-md"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Badge variant="default" className="px-4 py-2">All</Badge>
          <Badge variant="outline" className="px-4 py-2">Project Management</Badge>
          <Badge variant="outline" className="px-4 py-2">Documentation</Badge>
          <Badge variant="outline" className="px-4 py-2">Workspace</Badge>
        </div>

        {/* Sources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {sources.map((source) => (
            <Card 
              key={source.id} 
              className="relative hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <CardContent className="p-8 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <source.icon className="h-8 w-8 text-primary" size={32} />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">{source.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{source.description}</p>
                {source.connected && (
                  <Badge variant="secondary" className="text-xs">
                    Connected
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};