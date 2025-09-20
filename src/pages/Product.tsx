import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2 } from "lucide-react";

export const Product = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <Wand2 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Product & Engineering</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Product Development Hub</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Central hub for product development and engineering resources:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Product roadmap and feature specifications</li>
              <li>Engineering standards and best practices</li>
              <li>API documentation and technical guides</li>
              <li>Code review processes and deployment procedures</li>
              <li>Architecture decisions and technical debt tracking</li>
              <li>Sprint planning and project management tools</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};