"use client"

import { useATMStore } from '@/hooks/use-atm-store';
import { ATMHeader } from '@/components/atm/ATMHeader';
import { LoginScreen } from '@/components/atm/LoginScreen';
import { Dashboard } from '@/components/atm/Dashboard';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const {
    balance,
    transactions,
    isAuthenticated,
    isLocked,
    loginAttempts,
    login,
    logout,
    deposit,
    withdraw,
    checkBalanceAdvice,
    advice,
    isAdviceLoading,
    hasHydrated
  } = useATMStore();

  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-6">
          <Skeleton className="h-20 w-full rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-[400px] w-full rounded-xl" />
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <ATMHeader onLogout={logout} isAuthenticated={isAuthenticated} />
        
        <main className="mt-8">
          {!isAuthenticated ? (
            <LoginScreen 
              onLogin={login} 
              isLocked={isLocked} 
              attempts={loginAttempts} 
            />
          ) : (
            <Dashboard 
              balance={balance}
              transactions={transactions}
              onDeposit={deposit}
              onWithdraw={withdraw}
              onCheckAdvice={checkBalanceAdvice}
              advice={advice}
              isAdviceLoading={isAdviceLoading}
            />
          )}
        </main>

        <footer className="mt-12 py-8 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground font-medium flex items-center justify-center gap-2">
            Secure Session Protected by ATM Simulator Shield
          </p>
          <div className="flex justify-center gap-4 mt-2">
            <span className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-[0.2em]">Compliance v2.4</span>
            <span className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-[0.2em]">Encrypted-256</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
