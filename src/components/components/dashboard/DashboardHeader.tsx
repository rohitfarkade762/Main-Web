import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Zap } from "lucide-react";
import Export from "./Export";


interface DashboardHeaderProps {
  reportData?: any; // tighten this type to your actual report shape if available
}

export function DashboardHeader({ reportData }: DashboardHeaderProps) {


  return (
    <header className="glass-card rounded-2xl p-5 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
          <Zap className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">MCB Test Dashboard</h1>
          <p className="text-sm text-muted-foreground">Miniature Circuit Breaker Testing System</p>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-2">
        
      <Export data ={ reportData }/>
      </div>
    </header>
  );
}
