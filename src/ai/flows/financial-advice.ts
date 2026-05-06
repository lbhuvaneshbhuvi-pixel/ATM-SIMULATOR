'use server';
/**
 * @fileOverview A Genkit flow for generating smart financial advice or tips based on recent transactions.
 *
 * - financialAdvice - A function that handles the financial advice generation process.
 * - FinancialAdviceInput - The input type for the financialAdvice function.
 * - FinancialAdviceOutput - The return type for the financialAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialAdviceInputSchema = z.object({
  transactionType: z.enum(['deposit', 'withdrawal', 'check_balance']).describe('The type of recent transaction (deposit, withdrawal, or check_balance).'),
  amount: z.number().optional().describe('The amount involved in the transaction, if applicable.'),
});
export type FinancialAdviceInput = z.infer<typeof FinancialAdviceInputSchema>;

const FinancialAdviceOutputSchema = z.object({
  advice: z.string().describe('A personalized or general financial tip relevant to the transaction.'),
});
export type FinancialAdviceOutput = z.infer<typeof FinancialAdviceOutputSchema>;

export async function financialAdvice(input: FinancialAdviceInput): Promise<FinancialAdviceOutput> {
  return financialAdviceFlow(input);
}

const financialAdvicePrompt = ai.definePrompt({
  name: 'financialAdvicePrompt',
  input: {schema: FinancialAdviceInputSchema},
  output: {schema: FinancialAdviceOutputSchema},
  prompt: `You are a helpful financial advisor. Provide a concise and smart financial tip based on the user's recent activity.

Recent Activity:
Transaction Type: {{{transactionType}}}
{{#if amount}}
Amount: ₹{{{amount}}}
{{/if}}

Provide advice that is relevant to this activity. Keep the advice actionable and easy to understand. The advice should be encouraging and focus on good financial habits.`,
});

const financialAdviceFlow = ai.defineFlow(
  {
    name: 'financialAdviceFlow',
    inputSchema: FinancialAdviceInputSchema,
    outputSchema: FinancialAdviceOutputSchema,
  },
  async (input) => {
    const {output} = await financialAdvicePrompt(input);
    return output!;
  }
);
