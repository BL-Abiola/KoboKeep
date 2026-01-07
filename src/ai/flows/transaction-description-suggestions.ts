'use server';

/**
 * @fileOverview A flow for suggesting transaction descriptions based on past transactions.
 *
 * - suggestTransactionDescription - A function that suggests transaction descriptions.
 * - SuggestTransactionDescriptionInput - The input type for the suggestTransactionDescription function.
 * - SuggestTransactionDescriptionOutput - The return type for the suggestTransactionDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTransactionDescriptionInputSchema = z.object({
  currentDescription: z.string().describe('The current transaction description being entered by the user.'),
  pastTransactions: z.array(z.string()).describe('An array of past transaction descriptions.'),
});
export type SuggestTransactionDescriptionInput = z.infer<typeof SuggestTransactionDescriptionInputSchema>;

const SuggestTransactionDescriptionOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('An array of suggested transaction descriptions.'),
});
export type SuggestTransactionDescriptionOutput = z.infer<typeof SuggestTransactionDescriptionOutputSchema>;

export async function suggestTransactionDescription(
  input: SuggestTransactionDescriptionInput
): Promise<SuggestTransactionDescriptionOutput> {
  return suggestTransactionDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTransactionDescriptionPrompt',
  input: {schema: SuggestTransactionDescriptionInputSchema},
  output: {schema: SuggestTransactionDescriptionOutputSchema},
  prompt: `You are a helpful assistant that suggests transaction descriptions based on past transactions.

  Current description: {{{currentDescription}}}
  Past transactions: {{#each pastTransactions}}- {{{this}}}\n{{/each}}

  Suggest similar transaction descriptions that the user can use.
  Return at most 5 suggestions.
  If there are no past transactions, return an empty array.
  `,
});

const suggestTransactionDescriptionFlow = ai.defineFlow(
  {
    name: 'suggestTransactionDescriptionFlow',
    inputSchema: SuggestTransactionDescriptionInputSchema,
    outputSchema: SuggestTransactionDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
