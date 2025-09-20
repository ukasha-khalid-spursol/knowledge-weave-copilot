import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export const HelpDesk = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <MessageSquare className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">IT Help Desk</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>IT Support Center</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Welcome to the IT Help Desk. Here you can find assistance with:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Hardware troubleshooting and replacement requests</li>
              <li>Software installation and license management</li>
              <li>Network connectivity and VPN issues</li>
              <li>Account access and password resets</li>
              <li>Security incident reporting</li>
              <li>Equipment requests and procurement</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};