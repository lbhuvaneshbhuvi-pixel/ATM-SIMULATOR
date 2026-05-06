"use client"

import { Landmark, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useATMStore } from '@/hooks/use-atm-store';

interface ATMHeaderProps {
  onLogout: () => void;
  isAuthenticated: boolean;
}

export function ATMHeader({ onLogout, isAuthenticated }: ATMHeaderProps) {
  const { userProfile } = useATMStore();

  return (
    <header className="flex items-center justify-between p-4 mb-6 bg-white border-b shadow-sm rounded-t-xl">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-primary rounded-lg text-primary-foreground">
          <Landmark size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-primary">{userProfile.bankName}</h1>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">ATM Simulator</p>
        </div>
      </div>
      
      {isAuthenticated && (
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-full border">
            <User size={14} className="text-primary" />
            <span className="text-sm font-semibold text-primary">{userProfile.name}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onLogout}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-2 transition-colors"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Exit Session</span>
          </Button>
        </div>
      )}
    </header>
  );
}
