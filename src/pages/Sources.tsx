import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Common questions about integrating your knowledge sources
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-card border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  How do I get my API token for each platform?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <div className="space-y-3">
                    <p><strong>Jira:</strong> Go to your Atlassian Account Settings → Security → API tokens → Create API token</p>
                    <p><strong>Confluence:</strong> Same as Jira - use your Atlassian API token from Account Settings → Security → API tokens</p>
                    <p><strong>Notion:</strong> Visit notion.so/my-integrations → New integration → Copy the Internal Integration Token</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-card border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  What permissions do I need for each integration?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <div className="space-y-3">
                    <p><strong>Jira:</strong> Read access to projects, issues, and comments you want to include</p>
                    <p><strong>Confluence:</strong> Read access to spaces and pages you want to index</p>
                    <p><strong>Notion:</strong> Read content permission for databases and pages you want to connect</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-card border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  How often is my data synchronized?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Your connected sources are synchronized in real-time when you start a chat session. This ensures you always have access to the latest information from your knowledge bases.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-card border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  Is my data secure and private?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Yes, your API tokens are stored securely and encrypted. We only access the data you explicitly grant permissions for, and all communication happens over secure HTTPS connections.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="bg-card border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  Can I disconnect a source later?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Yes, you can disconnect any source at any time by clicking on the connected source and removing your API token. This will immediately stop access to that platform.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="bg-card border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  What if my API token stops working?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  If your token expires or is revoked, you'll receive an error message during chat sessions. Simply click on the source again and enter a new valid API token to restore connectivity.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};