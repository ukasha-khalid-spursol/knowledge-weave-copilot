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
      <Card className="h-[700px] flex flex-col max-w-6xl mx-auto">
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
  );
};