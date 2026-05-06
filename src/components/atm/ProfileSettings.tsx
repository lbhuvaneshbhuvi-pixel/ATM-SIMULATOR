"use client"

import { useState, useMemo } from 'react';
import { User, Shield, Target, Save, Landmark, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { UserProfile } from '@/lib/types';
import { cn } from '@/lib/utils';

const POPULAR_BANKS = [
  "Axis Bank",
  "Bank of Baroda",
  "Canara Bank",
  "Central Bank of India",
  "Federal Bank",
  "HDFC Bank",
  "ICICI Bank",
  "IDBI Bank",
  "Indian Bank",
  "Indian Overseas Bank",
  "IndusInd Bank",
  "Karnataka Bank",
  "Karur Vysya Bank",
  "Kotak Mahindra Bank",
  "National Rupee Bank",
  "Punjab National Bank",
  "South Indian Bank",
  "State Bank of India",
  "UCO Bank",
  "Union Bank of India",
  "Yes Bank"
];

interface ProfileSettingsProps {
  profile: UserProfile;
  onUpdate: (profile: Partial<UserProfile>) => void;
}

export function ProfileSettings({ profile, onUpdate }: ProfileSettingsProps) {
  const [formData, setFormData] = useState({
    name: profile.name,
    bankName: profile.bankName,
    pin: profile.pin,
    savingsGoal: profile.savingsGoal.toString()
  });
  const [isBankOpen, setIsBankOpen] = useState(false);

  const filteredBanks = useMemo(() => {
    if (!formData.bankName) return POPULAR_BANKS;
    return POPULAR_BANKS.filter(bank => 
      bank.toLowerCase().includes(formData.bankName.toLowerCase())
    );
  }, [formData.bankName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      name: formData.name,
      bankName: formData.bankName,
      pin: formData.pin,
      savingsGoal: Number(formData.savingsGoal)
    });
  };

  const selectBank = (bank: string) => {
    setFormData({ ...formData, bankName: bank });
    setIsBankOpen(false);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="bg-white border-none shadow-xl">
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <User size={20} />
            Customer Profile
          </CardTitle>
          <CardDescription>Manage your bank account details and security settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 relative">
                <Label htmlFor="bankName" className="text-muted-foreground font-semibold">Bank Name</Label>
                <Popover open={isBankOpen && filteredBanks.length > 0} onOpenChange={setIsBankOpen}>
                  <PopoverTrigger asChild>
                    <div className="relative">
                      <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <Input 
                        id="bankName"
                        value={formData.bankName}
                        autoComplete="off"
                        onChange={(e) => {
                          setFormData({...formData, bankName: e.target.value});
                          setIsBankOpen(true);
                        }}
                        onFocus={() => setIsBankOpen(true)}
                        className="pl-10 h-12 rounded-xl"
                        placeholder="Type to search bank (e.g. Ka...)"
                      />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent 
                    className="p-0 w-[--radix-popover-trigger-width] shadow-2xl border-primary/10" 
                    align="start"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                  >
                    <ScrollArea className="h-[200px]">
                      <div className="p-1">
                        {filteredBanks.map((bank) => (
                          <button
                            key={bank}
                            type="button"
                            onClick={() => selectBank(bank)}
                            className={cn(
                              "w-full text-left px-3 py-2.5 text-sm rounded-lg flex items-center justify-between transition-colors",
                              formData.bankName === bank ? "bg-primary text-primary-foreground" : "hover:bg-secondary/50 text-foreground"
                            )}
                          >
                            <span className="font-medium">{bank}</span>
                            {formData.bankName === bank && <Check size={14} />}
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-muted-foreground font-semibold">Account Holder Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input 
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="pl-10 h-12 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pin" className="text-muted-foreground font-semibold">Security PIN</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input 
                    id="pin"
                    type="password"
                    maxLength={4}
                    value={formData.pin}
                    onChange={(e) => setFormData({...formData, pin: e.target.value})}
                    className="pl-10 h-12 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal" className="text-muted-foreground font-semibold">Monthly Savings Goal (₹)</Label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input 
                    id="goal"
                    type="number"
                    value={formData.savingsGoal}
                    onChange={(e) => setFormData({...formData, savingsGoal: e.target.value})}
                    className="pl-10 h-12 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg transition-all">
              <Save size={18} className="mr-2" />
              Update Account Details
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
