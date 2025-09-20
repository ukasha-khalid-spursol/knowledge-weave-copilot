import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "lucide-react";

export const Sources = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <Database className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Sources</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Data Sources Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Manage and configure your data sources for the AI assistant:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Connect to external databases and APIs</li>
              <li>Configure data synchronization schedules</li>
              <li>Monitor source health and connectivity</li>
              <li>Set up data filtering and transformation rules</li>
              <li>Manage access permissions and security</li>
              <li>View data source analytics and usage metrics</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};