export type TransactionType = 'deposit' | 'withdrawal' | 'check_balance' | 'transfer' | 'bill_payment';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  timestamp: Date;
  balanceAfter: number;
  description?: string;
}

export interface UserProfile {
  name: string;
  bankName: string;
  pin: string;
  avatarUrl?: string;
  savingsGoal: number;
  accountNumber: string;
  currentBalance: number; // For internal transfer simulation
}

export interface ATMState {
  balance: number;
  transactions: Transaction[];
  isAuthenticated: boolean;
  loginAttempts: number;
  isLocked: boolean;
  userProfile: UserProfile;
}
