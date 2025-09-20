import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";

export const Agents = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <Bot className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Knowledge Agents</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>AI Agent Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Configure and manage your AI knowledge agents:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Create specialized agents for different domains</li>
              <li>Train agents on specific knowledge bases</li>
              <li>Configure agent behavior and response styles</li>
              <li>Monitor agent performance and accuracy</li>
              <li>Set up multi-agent collaboration workflows</li>
              <li>Manage agent permissions and access controls</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};