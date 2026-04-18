"use client"

import { useState } from 'react';
import { User, Shield, Target, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { UserProfile } from '@/lib/types';

interface ProfileSettingsProps {
  profile: UserProfile;
  onUpdate: (profile: Partial<UserProfile>) => void;
}

export function ProfileSettings({ profile, onUpdate }: ProfileSettingsProps) {
  const [formData, setFormData] = useState({
    name: profile.name,
    pin: profile.pin,
    savingsGoal: profile.savingsGoal.toString()
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      name: formData.name,
      pin: formData.pin,
      savingsGoal: Number(formData.savingsGoal)
    });
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

              <div className="space-y-2 md:col-span-2">
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
