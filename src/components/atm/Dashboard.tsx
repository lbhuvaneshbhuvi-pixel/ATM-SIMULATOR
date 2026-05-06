"use client"

import { useState } from 'react';
import { Wallet, ArrowDownCircle, ArrowUpCircle, History, Lightbulb, TrendingUp, AlertCircle, X, BarChart3, Settings, QrCode, Send, Receipt, Smartphone, Landmark, Info, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Analytics } from './Analytics';
import { ProfileSettings } from './ProfileSettings';
import { useATMStore } from '@/hooks/use-atm-store';
import { cn } from '@/lib/utils';

interface DashboardProps {
  balance: number;
  transactions: any[];
  onDeposit: (amount: number) => void;
  onWithdraw: (amount: number) => void;
  onCheckAdvice: () => void;
  advice: string | null;
  isAdviceLoading: boolean;
}

export function Dashboard({ 
  balance, 
  transactions, 
  onDeposit, 
  onWithdraw, 
  onCheckAdvice,
  advice,
  isAdviceLoading
}: DashboardProps) {
  const { userProfile, updateProfile, transferFunds, payBill, otpRequired, verifyOtp, cancelOtp } = useATMStore();
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [targetAccount, setTargetAccount] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [billType, setBillType] = useState('Electricity');
  const [showAdvice, setShowAdvice] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [otpValue, setOtpValue] = useState('');

  const goalProgress = Math.min((balance / userProfile.savingsGoal) * 100, 100);

  const isValidAmount = (val: string) => {
    const num = Number(val);
    return !isNaN(num) && num > 0 && num % 100 === 0;
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onDeposit(Number(depositAmount));
    setDepositAmount('');
    setShowAdvice(true);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onWithdraw(Number(withdrawAmount));
    setWithdrawAmount('');
    setShowAdvice(true);
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    transferFunds(Number(transferAmount), targetAccount);
    setTransferAmount('');
    setTargetAccount('');
  };

  const handlePayBill = (e: React.FormEvent) => {
    e.preventDefault();
    payBill(Number(billAmount), billType);
    setBillAmount('');
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyOtp(otpValue)) {
      setOtpValue('');
    }
  };

  const generateQR = () => {
    const code = Math.random().toString(36).substring(7).toUpperCase();
    setQrCode(code);
    setTimeout(() => setQrCode(null), 30000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* OTP Verification Dialog */}
      <Dialog open={otpRequired} onOpenChange={(open) => !open && cancelOtp()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="text-primary" />
              OTP Verification
            </DialogTitle>
            <DialogDescription>
              A 6-digit verification code has been sent to your registered mobile for this high-value transaction. (Demo: 123456)
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleOtpSubmit} className="space-y-4 py-4">
            <Input 
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              value={otpValue}
              onChange={(e) => setOtpValue(e.target.value)}
              className="text-center text-2xl tracking-[0.5rem] font-bold h-12"
            />
            <Button type="submit" className="w-full font-bold h-12">Verify & Authorize</Button>
          </form>
          <DialogFooter>
            <Button variant="ghost" onClick={cancelOtp} className="text-destructive">Cancel Transaction</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Balance Card */}
      <Card className="lg:col-span-8 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-none shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Landmark size={160} />
        </div>
        <CardHeader className="relative z-10 pb-0">
          <CardTitle className="text-primary-foreground/80 font-medium text-lg flex items-center gap-2">
            <Wallet size={20} />
            {userProfile.bankName} - Account: {userProfile.accountNumber}
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10 pt-4 pb-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-6xl font-black tracking-tight drop-shadow-sm">
              ₹{balance.toLocaleString('en-IN')}
            </h2>
            <div className="flex items-center gap-2 mt-4 text-primary-foreground/90 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">
              <TrendingUp size={16} />
              <span className="text-sm font-semibold">Goal: ₹{userProfile.savingsGoal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-white/5 border-t border-white/10 px-6 py-4 relative z-10 flex justify-between items-center">
           <div className="flex flex-col gap-1">
              <span className="text-xs text-primary-foreground/60 uppercase font-bold tracking-tighter">Savings Progress</span>
              <div className="flex items-center gap-3">
                <Progress value={goalProgress} className="h-2 w-32 bg-white/20" />
                <span className="text-[10px] font-black">{Math.round(goalProgress)}%</span>
              </div>
           </div>
           <Button 
            variant="outline" 
            size="sm" 
            className="bg-accent text-accent-foreground border-none hover:bg-accent/90 hover:text-accent-foreground font-bold shadow-lg"
            onClick={() => { onCheckAdvice(); setShowAdvice(true); }}
            disabled={isAdviceLoading}
           >
             {isAdviceLoading ? "Analyzing..." : "AI Advisor"}
           </Button>
        </CardFooter>
      </Card>

      {/* Advice Overlay */}
      {(showAdvice && advice) && (
        <div className="lg:col-span-12 animate-in slide-in-from-top duration-300">
          <Card className="bg-accent/10 border-accent/20 border-2 overflow-hidden">
            <div className="flex items-start gap-4 p-5">
              <div className="p-3 bg-accent rounded-xl text-accent-foreground shadow-md animate-bounce">
                <Lightbulb size={24} />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                   <h4 className="font-bold text-primary flex items-center gap-2">
                    Smart AI Tip
                    <Badge variant="outline" className="text-[10px] uppercase tracking-widest border-primary/20 bg-white/50">Real-Time</Badge>
                   </h4>
                   <button onClick={() => setShowAdvice(false)} className="text-muted-foreground hover:text-primary transition-colors">
                     <X size={16} />
                   </button>
                </div>
                <p className="text-sm leading-relaxed text-primary/80 italic">"{advice}"</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* QR Cash Mini Card */}
      <Card className="lg:col-span-4 bg-white border-none shadow-xl flex flex-col justify-center items-center p-6 text-center">
        {qrCode ? (
          <div className="space-y-4 animate-in zoom-in duration-300">
             <div className="p-6 bg-primary/5 rounded-2xl border-2 border-dashed border-primary/20">
                <QrCode size={120} className="text-primary mx-auto" />
             </div>
             <div>
                <p className="text-xs font-bold text-primary uppercase tracking-widest">Code: {qrCode}</p>
                <p className="text-[10px] text-muted-foreground mt-1">Scan at any ATM for Cardless Cash</p>
             </div>
             <Button variant="ghost" size="sm" onClick={() => setQrCode(null)} className="text-xs text-destructive">Cancel</Button>
          </div>
        ) : (
          <>
            <div className="p-4 bg-primary/10 rounded-full mb-4">
              <Smartphone size={32} className="text-primary" />
            </div>
            <h3 className="text-lg font-bold text-primary">Cardless Withdrawal</h3>
            <p className="text-muted-foreground text-xs mb-4">Withdraw cash securely using your phone.</p>
            <Button onClick={generateQR} className="w-full bg-primary hover:bg-primary/90 font-bold">Generate QR Code</Button>
          </>
        )}
      </Card>

      {/* Main Feature Tabs */}
      <div className="lg:col-span-12">
        <Tabs defaultValue="operations" className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-14 p-1 bg-white shadow-md rounded-xl">
            <TabsTrigger value="operations" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs flex gap-1">
              <Wallet size={14} /> <span className="hidden sm:inline">Transact</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs flex gap-1">
              <Send size={14} /> <span className="hidden sm:inline">Services</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs flex gap-1">
              <History size={14} /> <span className="hidden sm:inline">Statement</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs flex gap-1">
              <BarChart3 size={14} /> <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs flex gap-1">
              <Settings size={14} /> <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="operations" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white border-none shadow-xl">
                <CardHeader>
                  <CardTitle className="text-primary text-lg flex items-center gap-2">Deposit & Withdrawal</CardTitle>
                  <CardDescription className="flex items-center gap-1.5 text-xs font-semibold text-primary/60">
                    <Info size={12} /> Only ₹100, ₹200, ₹500 notes accepted
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="deposit" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary/50 p-1">
                      <TabsTrigger value="deposit" className="data-[state=active]:bg-white data-[state=active]:text-primary py-2.5 font-bold">
                        Deposit
                      </TabsTrigger>
                      <TabsTrigger value="withdraw" className="data-[state=active]:bg-white data-[state=active]:text-primary py-2.5 font-bold">
                        Withdraw
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="deposit">
                      <form onSubmit={handleDepositSubmit} className="space-y-4">
                        <Input
                          type="number"
                          placeholder="Amount (e.g., 500)"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          className={cn(
                            "h-12 text-xl font-bold rounded-xl",
                            depositAmount && !isValidAmount(depositAmount) && "border-destructive focus-visible:ring-destructive"
                          )}
                        />
                        <Button className="w-full h-12 font-bold bg-primary hover:bg-primary/90" disabled={!isValidAmount(depositAmount)}>
                          Confirm Deposit
                        </Button>
                      </form>
                    </TabsContent>
                    <TabsContent value="withdraw">
                      <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                        <Input
                          type="number"
                          placeholder="Amount (e.g., 200)"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          className={cn(
                            "h-12 text-xl font-bold rounded-xl",
                            withdrawAmount && !isValidAmount(withdrawAmount) && "border-destructive focus-visible:ring-destructive"
                          )}
                        />
                        <Button className="w-full h-12 font-bold bg-primary hover:bg-primary/90" disabled={!isValidAmount(withdrawAmount) || Number(withdrawAmount) > balance}>
                          Confirm Withdrawal
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <Card className="bg-white border-none shadow-xl overflow-hidden flex flex-col">
                <CardHeader>
                  <CardTitle className="text-primary text-lg flex items-center gap-2">Quick History</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-4">
                    {transactions.slice(0, 3).map((t) => (
                      <div key={t.id} className="flex justify-between items-center p-3 bg-secondary/20 rounded-xl border border-secondary/30">
                        <div className="flex gap-2 items-center">
                          <div className={`p-1.5 rounded-md ${t.type === 'deposit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {t.type === 'deposit' ? <ArrowDownCircle size={16} /> : <ArrowUpCircle size={16} />}
                          </div>
                          <span className="text-xs font-bold capitalize">{t.type}</span>
                        </div>
                        <span className={`text-sm font-black ${t.type === 'deposit' ? 'text-green-600' : 'text-primary'}`}>₹{t.amount}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="bg-secondary/10 border-t py-4">
                  <Button variant="ghost" size="sm" className="w-full text-xs text-primary font-bold">View Detailed Statement <Receipt size={14} className="ml-2"/></Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="services" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white border-none shadow-xl">
                <CardHeader>
                  <CardTitle className="text-primary text-lg flex items-center gap-2">
                    <Send size={18} /> Funds Transfer
                  </CardTitle>
                  <CardDescription>Securely transfer to other accounts.</CardDescription>
                </CardHeader>
                <CardContent>
                   <form onSubmit={handleTransfer} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground">Recipient Account No.</label>
                        <Input placeholder="XXXX-XXXX-XXXX" value={targetAccount} onChange={(e) => setTargetAccount(e.target.value)} className="h-10" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground">Amount (₹)</label>
                        <Input type="number" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} className="h-10 font-bold" />
                      </div>
                      <Button className="w-full bg-accent text-accent-foreground font-bold" disabled={!targetAccount || !transferAmount || Number(transferAmount) > balance}>
                        Transfer Funds
                      </Button>
                   </form>
                </CardContent>
              </Card>

              <Card className="bg-white border-none shadow-xl">
                <CardHeader>
                  <CardTitle className="text-primary text-lg flex items-center gap-2">
                    <Receipt size={18} /> Bill Payments
                  </CardTitle>
                  <CardDescription>Instant utility settlement.</CardDescription>
                </CardHeader>
                <CardContent>
                   <form onSubmit={handlePayBill} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground">Select Utility</label>
                        <Select value={billType} onValueChange={setBillType}>
                          <SelectTrigger className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Electricity">Electricity</SelectItem>
                            <SelectItem value="Water">Water Supply</SelectItem>
                            <SelectItem value="Internet">Broadband / Fiber</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground">Amount (₹)</label>
                        <Input type="number" value={billAmount} onChange={(e) => setBillAmount(e.target.value)} className="h-10 font-bold" />
                      </div>
                      <Button className="w-full bg-primary text-primary-foreground font-bold" disabled={!billAmount || Number(billAmount) > balance}>
                        Pay Securely
                      </Button>
                   </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card className="bg-white border-none shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between border-b pb-6">
                <div>
                  <CardTitle className="text-primary text-lg flex items-center gap-2">Mini Statement</CardTitle>
                  <CardDescription>Showing last 5 transactions</CardDescription>
                </div>
                <Badge variant="outline" className="font-mono bg-primary/5 border-primary/20 text-primary">₹{balance.toLocaleString('en-IN')}</Badge>
              </CardHeader>
              <CardContent className="p-0">
                {transactions.length > 0 ? (
                  <div className="divide-y">
                    {transactions.slice(0, 5).map((t) => (
                      <div key={t.id} className="flex items-center justify-between p-4 hover:bg-secondary/10 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            t.type === 'deposit' ? 'bg-green-100 text-green-600' : 
                            t.type === 'withdrawal' ? 'bg-red-100 text-red-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            {t.type === 'deposit' ? <ArrowDownCircle size={18} /> : <ArrowUpCircle size={18} />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-primary capitalize">{t.type.replace('_', ' ')}</p>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">{t.timestamp.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-black ${t.type === 'deposit' ? 'text-green-600' : 'text-primary'}`}>
                            {t.type === 'deposit' ? '+' : '-'} ₹{t.amount.toLocaleString('en-IN')}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-mono">Bal: ₹{t.balanceAfter.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <History size={48} className="mx-auto text-muted-foreground/20 mb-4" />
                    <p className="text-muted-foreground text-sm font-medium italic">No recent transactions to display.</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t py-4 justify-center bg-secondary/5">
                <p className="text-[9px] text-muted-foreground uppercase font-black tracking-[0.2em]">End of Mini Statement</p>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Analytics transactions={transactions} balance={balance} />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <ProfileSettings profile={userProfile} onUpdate={updateProfile} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
