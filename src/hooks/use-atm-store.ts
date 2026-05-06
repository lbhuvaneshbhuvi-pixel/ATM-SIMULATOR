"use client"

import { useState, useEffect, useCallback } from 'react';
import { Transaction, TransactionType, ATMState, UserProfile } from '@/lib/types';
import { financialAdvice } from '@/ai/flows/financial-advice';
import { useToast } from '@/hooks/use-toast';

const INITIAL_BALANCE = 1000;
const MAX_ATTEMPTS = 3;
const STORAGE_KEY = 'rupee_atm_state_v4';
const OTP_THRESHOLD = 5000;

const DEFAULT_PROFILE: UserProfile = {
  name: "Prateek S.",
  bankName: "National Rupee Bank",
  pin: "1234",
  savingsGoal: 5000,
  accountNumber: "XXXX-XXXX-9876",
  currentBalance: 2500,
};

export function useATMStore() {
  const { toast } = useToast();
  const [state, setState] = useState<ATMState>({
    balance: INITIAL_BALANCE,
    transactions: [],
    isAuthenticated: false,
    loginAttempts: 0,
    isLocked: false,
    userProfile: DEFAULT_PROFILE,
  });
  
  const [advice, setAdvice] = useState<string | null>(null);
  const [isAdviceLoading, setIsAdviceLoading] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  
  // OTP Simulation State
  const [otpRequired, setOtpRequired] = useState(false);
  const [pendingTransaction, setPendingTransaction] = useState<{
    type: TransactionType;
    amount: number;
    description?: string;
  } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setState(prev => ({
          ...prev,
          balance: parsed.balance ?? INITIAL_BALANCE,
          userProfile: { ...DEFAULT_PROFILE, ...(parsed.userProfile ?? {}) },
          transactions: parsed.transactions?.map((t: any) => ({
            ...t,
            timestamp: new Date(t.timestamp)
          })) ?? []
        }));
      } catch (e) {
        console.error("Failed to parse stored ATM state", e);
      }
    }
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (hasHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        balance: state.balance,
        transactions: state.transactions,
        userProfile: state.userProfile
      }));
    }
  }, [state.balance, state.transactions, state.userProfile, hasHydrated]);

  const isValidDenomination = (amount: number) => {
    return amount > 0 && amount % 100 === 0;
  };

  const login = useCallback((pin: string) => {
    try {
      if (state.isLocked) {
        throw new Error("Account Locked. Contact Support.");
      }

      if (pin === state.userProfile.pin) {
        setState(prev => ({ ...prev, isAuthenticated: true, loginAttempts: 0 }));
        return true;
      } else {
        const nextAttempts = state.loginAttempts + 1;
        const isLocked = nextAttempts >= MAX_ATTEMPTS;
        setState(prev => ({ 
          ...prev, 
          loginAttempts: nextAttempts,
          isLocked: isLocked 
        }));
        
        throw new Error(isLocked 
          ? "Account locked after 3 failed attempts." 
          : `Invalid PIN! ${MAX_ATTEMPTS - nextAttempts} attempts remaining.`);
      }
    } catch (e: any) {
      toast({ variant: "destructive", title: "Authentication Error", description: e.message });
      return false;
    }
  }, [state.loginAttempts, state.isLocked, state.userProfile.pin, toast]);

  const biometricLogin = useCallback(() => {
    setState(prev => ({ ...prev, isAuthenticated: true, loginAttempts: 0 }));
    toast({ title: "Biometric Success", description: "Identity verified via Fingerprint." });
  }, [toast]);

  const logout = useCallback(() => {
    setState(prev => ({ ...prev, isAuthenticated: false }));
    setAdvice(null);
  }, []);

  const updateProfile = useCallback((profile: Partial<UserProfile>) => {
    setState(prev => ({
      ...prev,
      userProfile: { ...prev.userProfile, ...profile }
    }));
    toast({ title: "Profile Updated", description: "Account details updated successfully." });
  }, [toast]);

  const addTransaction = useCallback((type: TransactionType, amount: number, description?: string) => {
    const isDeduction = ['withdrawal', 'transfer', 'bill_payment'].includes(type);
    const newBalance = isDeduction ? state.balance - amount : state.balance + amount;
    
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      amount,
      timestamp: new Date(),
      balanceAfter: newBalance,
      description
    };

    setState(prev => ({
      ...prev,
      balance: newBalance,
      transactions: [newTransaction, ...prev.transactions]
    }));

    return newBalance;
  }, [state.balance]);

  const executeTransaction = (type: TransactionType, amount: number, description?: string) => {
    const isDeduction = ['withdrawal', 'transfer', 'bill_payment'].includes(type);
    const newBalance = isDeduction ? state.balance - amount : state.balance + amount;
    
    addTransaction(type, amount, description);
    toast({ 
      title: "Transaction Successful!", 
      description: `Current balance: ₹${newBalance.toLocaleString('en-IN')}` 
    });
    setPendingTransaction(null);
    setOtpRequired(false);
  };

  const deposit = useCallback((amount: number) => {
    if (!isValidDenomination(amount)) {
      toast({ variant: "destructive", title: "Invalid Denomination", description: "Please use ₹100, ₹200, or ₹500 notes." });
      return;
    }
    executeTransaction('deposit', amount);
  }, [toast, state.balance]);

  const withdraw = useCallback((amount: number) => {
    if (!isValidDenomination(amount)) {
      toast({ variant: "destructive", title: "Invalid Denomination", description: "Withdrawal must be a multiple of ₹100." });
      return;
    }
    if (amount > state.balance) {
      toast({ variant: "destructive", title: "Insufficient Balance", description: "Transaction failed. Check your balance." });
      return;
    }

    if (amount >= OTP_THRESHOLD) {
      setPendingTransaction({ type: 'withdrawal', amount });
      setOtpRequired(true);
      toast({ title: "OTP Required", description: "Sent a 6-digit OTP to your registered mobile." });
    } else {
      executeTransaction('withdrawal', amount);
    }
  }, [state.balance, toast]);

  const transferFunds = useCallback((amount: number, toAccount: string) => {
    if (amount <= 0 || amount > state.balance) {
      toast({ variant: "destructive", title: "Transfer Failed", description: "Invalid amount or insufficient balance." });
      return;
    }

    if (amount >= OTP_THRESHOLD) {
      setPendingTransaction({ type: 'transfer', amount, description: `Transfer to ${toAccount}` });
      setOtpRequired(true);
      toast({ title: "OTP Required", description: "Secure OTP needed for transfers above ₹5,000." });
    } else {
      executeTransaction('transfer', amount, `Transfer to ${toAccount}`);
    }
  }, [state.balance, toast]);

  const payBill = useCallback((amount: number, billType: string) => {
    if (amount <= 0 || amount > state.balance) {
      toast({ variant: "destructive", title: "Payment Failed", description: "Insufficient balance." });
      return;
    }
    executeTransaction('bill_payment', amount, `${billType} Bill`);
  }, [state.balance, toast]);

  const verifyOtp = (code: string) => {
    if (code === "123456" && pendingTransaction) {
      executeTransaction(pendingTransaction.type, pendingTransaction.amount, pendingTransaction.description);
      return true;
    } else {
      toast({ variant: "destructive", title: "OTP Failed", description: "Invalid code. Please try again." });
      return false;
    }
  };

  const checkBalanceAdvice = useCallback(() => {
    setIsAdviceLoading(true);
    financialAdvice({ transactionType: 'check_balance', amount: state.balance })
      .then(res => setAdvice(res.advice))
      .finally(() => setIsAdviceLoading(false));
  }, [state.balance]);

  return {
    ...state,
    login,
    biometricLogin,
    logout,
    deposit,
    withdraw,
    transferFunds,
    payBill,
    checkBalanceAdvice,
    updateProfile,
    advice,
    isAdviceLoading,
    hasHydrated,
    otpRequired,
    setOtpRequired,
    verifyOtp,
    cancelOtp: () => { setOtpRequired(false); setPendingTransaction(null); }
  };
}
