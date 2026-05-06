"use client"

import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Transaction } from '@/lib/types';
import { TrendingUp, TrendingDown, PieChart } from 'lucide-react';

interface AnalyticsProps {
  transactions: Transaction[];
  balance: number;
}

export function Analytics({ transactions, balance }: AnalyticsProps) {
  const chartData = useMemo(() => {
    return transactions.slice().reverse().map(t => ({
      time: t.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      balance: t.balanceAfter,
      amount: t.amount,
      type: t.type
    }));
  }, [transactions]);

  const stats = useMemo(() => {
    const deposits = transactions.filter(t => t.type === 'deposit').reduce((acc, t) => acc + t.amount, 0);
    const withdrawals = transactions.filter(t => t.type === 'withdrawal').reduce((acc, t) => acc + t.amount, 0);
    return { deposits, withdrawals };
  }, [transactions]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white border-none shadow-lg overflow-hidden">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <TrendingUp size={14} className="text-green-500" />
              Total Deposits
            </CardDescription>
            <CardTitle className="text-2xl font-black text-primary">₹{stats.deposits.toLocaleString('en-IN')}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-white border-none shadow-lg overflow-hidden">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <TrendingDown size={14} className="text-orange-500" />
              Total Withdrawals
            </CardDescription>
            <CardTitle className="text-2xl font-black text-primary">₹{stats.withdrawals.toLocaleString('en-IN')}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="bg-white border-none shadow-xl">
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <PieChart size={20} />
            Balance Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] w-full pt-4">
          {chartData.length > 0 ? (
            <ChartContainer config={{
              balance: { label: 'Balance', color: 'hsl(var(--primary))' }
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                  <XAxis 
                    dataKey="time" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                  />
                  <YAxis hide />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorBalance)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground italic">
              Perform some transactions to see trends.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
