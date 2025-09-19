import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, ExternalLink, Settings } from "lucide-react";

interface IntegrationCardProps {
  name: string;
  description: string;
  status: "connected" | "disconnected" | "error";
  lastSync?: string;
  itemCount?: number;
  icon: React.ReactNode;
}

export const IntegrationCard = ({ 
  name, 
  description, 
  status, 
  lastSync, 
  itemCount, 
  icon 
}: IntegrationCardProps) => {
  const getStatusBadge = () => {
    switch (status) {
      case "connected":
        return (
          <Badge className="bg-success text-success-foreground">
            <CheckCircle className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        );
      case "error":
        return (
          <Badge className="bg-destructive text-destructive-foreground">
            <AlertCircle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            Disconnected
          </Badge>
        );
    }
  };

  return (
    <Card className="p-6 hover:shadow-card transition-all duration-200 hover:bg-card-hover">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-accent rounded-lg">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">{name}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        {getStatusBadge()}
      </div>
      
      {status === "connected" && (
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Last sync:</span>
            <span className="text-card-foreground">{lastSync}</span>
          </div>
          {itemCount && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Items indexed:</span>
              <span className="text-card-foreground">{itemCount.toLocaleString()}</span>
            </div>
          )}
        </div>
      )}
      
      <div className="flex space-x-2">
        <Button 
          size="sm" 
          variant={status === "connected" ? "secondary" : "default"}
          className="flex-1"
        >
          <Settings className="h-4 w-4 mr-2" />
          {status === "connected" ? "Manage" : "Connect"}
        </Button>
        {status === "connected" && (
          <Button size="sm" variant="ghost">
            <ExternalLink className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Card>
  );
};