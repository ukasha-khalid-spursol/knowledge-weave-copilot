import { ChatInterface } from "@/components/Chat/ChatInterface";
import { MultiAgentChatInterface } from "@/components/Chat/MultiAgentChatInterface";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare,
  Bot
} from "lucide-react";

export const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      {/* Chat Interface */}
      <Card className="h-[700px] flex flex-col max-w-6xl mx-auto overflow-hidden">
        <div className="p-6 border-b border-border/50 flex-shrink-0 bg-background/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">AI Assistant Suite</h2>
              <p className="text-muted-foreground text-sm mt-1">Choose between single or multi-agent responses</p>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-200 hover:bg-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-800">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
              AI Ready
            </Badge>
          </div>
        </div>
        <div className="flex-1 min-h-0 overflow-hidden">
          <Tabs defaultValue="single" className="h-full flex flex-col">
            <TabsList className="grid grid-cols-2 mx-6 mt-6 mb-2 bg-muted/40 p-1 rounded-xl" style={{ width: 'calc(100% - 3rem)' }}>
              <TabsTrigger value="single" className="flex items-center space-x-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
                <MessageSquare className="h-4 w-4" />
                <span className="font-medium">Single Agent</span>
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center space-x-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
                <Bot className="h-4 w-4" />
                <span className="font-medium">Team Chat</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="single" className="flex-1 mt-0 overflow-hidden">
              <div className="h-full overflow-hidden">
                <ChatInterface />
              </div>
            </TabsContent>
            <TabsContent value="team" className="flex-1 mt-0 overflow-hidden">
              <div className="h-full overflow-hidden">
                <MultiAgentChatInterface />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
};