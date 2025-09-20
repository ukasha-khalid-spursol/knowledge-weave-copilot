import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export const Sales = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Sales & Support</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Sales & Customer Success Center</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Resources and tools for sales and customer support teams:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Sales playbooks and methodology guides</li>
              <li>Customer onboarding and success workflows</li>
              <li>Product pricing and competitive analysis</li>
              <li>Support ticket management and escalation procedures</li>
              <li>Customer health scoring and retention strategies</li>
              <li>Sales training materials and certification paths</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};