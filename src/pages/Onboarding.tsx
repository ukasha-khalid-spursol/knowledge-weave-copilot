import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export const Onboarding = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">New Hire Onboarding</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Your Onboarding Journey</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              This is a sample onboarding page for new hires. Here you would typically find:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Company introduction and culture overview</li>
              <li>Role-specific training materials</li>
              <li>Team introductions and contact information</li>
              <li>IT setup and access requests</li>
              <li>Benefits enrollment and HR documentation</li>
              <li>First week schedule and goals</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};