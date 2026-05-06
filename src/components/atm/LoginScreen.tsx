"use client"

import { useState } from 'react';
import { ShieldCheck, Lock, Fingerprint, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useATMStore } from '@/hooks/use-atm-store';

interface LoginScreenProps {
  onLogin: (pin: string) => boolean;
  isLocked: boolean;
  attempts: number;
}

const MAX_ATTEMPTS = 3;

export function LoginScreen({ onLogin, isLocked, attempts }: LoginScreenProps) {
  const [pin, setPin] = useState('');
  const { biometricLogin, userProfile } = useATMStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin(pin)) {
      setPin('');
    }
  };

  const handleKeyClick = (digit: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + digit);
    }
  };

  const clearPin = () => setPin('');

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] animate-in fade-in zoom-in duration-300">
      <Card className="w-full max-w-md border-none shadow-2xl bg-white overflow-hidden">
        <div className="bg-primary h-2 w-full" />
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 p-3 bg-primary/10 text-primary rounded-full w-fit">
            <ShieldCheck size={48} className="animate-pulse" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">{userProfile.bankName}</CardTitle>
          <CardDescription>Secure Banking Portal - Enter PIN</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <Input
                type="password"
                placeholder="••••"
                value={pin}
                readOnly
                className="text-center text-3xl h-16 tracking-[1rem] font-bold border-2 border-primary/20 focus:border-primary transition-all rounded-xl"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors" size={20} />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <Button
                  key={num}
                  type="button"
                  variant="outline"
                  className="h-14 text-xl font-bold rounded-xl border-primary/10 hover:border-primary hover:bg-primary/5 transition-all active:scale-95"
                  onClick={() => handleKeyClick(num.toString())}
                  disabled={isLocked}
                >
                  {num}
                </Button>
              ))}
              <Button
                type="button"
                variant="ghost"
                className="h-14 text-sm font-semibold rounded-xl text-destructive hover:bg-destructive/10"
                onClick={clearPin}
                disabled={isLocked}
              >
                Clear
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-14 text-xl font-bold rounded-xl border-primary/10 hover:border-primary hover:bg-primary/5"
                onClick={() => handleKeyClick('0')}
                disabled={isLocked}
              >
                0
              </Button>
              <Button
                type="submit"
                className="h-14 font-bold bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl shadow-lg active:scale-95 transition-all"
                disabled={isLocked || pin.length < 4}
              >
                Go
              </Button>
            </div>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">OR SECURE SCAN</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2 rounded-2xl border-primary/20 hover:bg-primary/5 hover:border-primary group"
              onClick={biometricLogin}
              disabled={isLocked}
            >
              <Fingerprint size={24} className="text-primary group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold">Fingerprint</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2 rounded-2xl border-primary/20 hover:bg-primary/5 hover:border-primary group"
              disabled={isLocked}
            >
              <Smartphone size={24} className="text-primary group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold">Mobile OTP</span>
            </Button>
          </div>

          {isLocked ? (
            <p className="text-center text-destructive font-semibold bg-destructive/10 py-3 rounded-xl border border-destructive/20">
              Account Locked. Contact {userProfile.bankName} Support.
            </p>
          ) : attempts > 0 && (
            <p className="text-center text-muted-foreground text-sm font-medium">
              Attempts remaining: <span className="text-destructive font-black underline">{MAX_ATTEMPTS - attempts}</span>
            </p>
          )}
          
          <p className="text-center text-[10px] text-muted-foreground mt-4 font-mono uppercase tracking-widest">
            SIMULATED SECURE NODE #ATM-9821
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
