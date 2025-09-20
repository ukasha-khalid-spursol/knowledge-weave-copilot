import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Database } from "lucide-react";
import { JiraIcon } from "@/components/icons/JiraIcon";
import { ConfluenceIcon } from "@/components/icons/ConfluenceIcon";
import { NotionIcon } from "@/components/icons/NotionIcon";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const sources = [
  {
    id: "jira",
    name: "Jira",
    icon: JiraIcon,
    description: "Project management and issue tracking",
  },
  {
    id: "confluence",
    name: "Confluence",
    icon: ConfluenceIcon,
    description: "Team collaboration and documentation",
  },
  {
    id: "notion",
    name: "Notion",
    icon: NotionIcon,
    description: "All-in-one workspace for notes and docs",
  },
];

export const Sources = () => {
  const [selectedSource, setSelectedSource] = useState<typeof sources[0] | null>(null);
  const [token, setToken] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSourceClick = (source: typeof sources[0]) => {
    setSelectedSource(source);
    setToken("");
    setIsDialogOpen(true);
  };

  const handleTokenSubmit = () => {
    if (!token.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid token",
        variant: "destructive",
      });
      return;
    }

    // Store token in localStorage (since no Supabase connection)
    localStorage.setItem(`${selectedSource?.id}_token`, token);
    
    toast({
      title: "Success",
      description: `${selectedSource?.name} token saved successfully`,
    });

    setToken("");
    setIsDialogOpen(false);
    setSelectedSource(null);
  };

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
              onClick={() => handleSourceClick(source)}
            >
              <CardContent className="p-8 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <source.icon className="" size={32} />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">{source.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{source.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Token Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect {selectedSource?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="token">API Token</Label>
                <Input
                  id="token"
                  type="password"
                  placeholder={`Enter your ${selectedSource?.name} API token`}
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleTokenSubmit}>
                  Save Token
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};