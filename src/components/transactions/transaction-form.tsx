'use client';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { DescriptionSuggester } from './description-suggester';
import { Transaction } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';

const formSchema = z.object({
  type: z.enum(['sale', 'expense']),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0."),
  paymentMethod: z.enum(['cash', 'card', 'transfer']),
  description: z.string().min(1, "Description is required.").max(100),
});

export function TransactionForm() {
  const { isTransactionSheetOpen, toggleTransactionSheet, editingTransactionId, transactions, addTransaction, updateTransaction } = useAppStore();
  const { toast } = useToast();

  const editingTransaction = editingTransactionId ? transactions.find(t => t.id === editingTransactionId) : null;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'sale',
      amount: 0,
      paymentMethod: 'cash',
      description: '',
    },
  });

  useEffect(() => {
    if (editingTransaction) {
      form.reset({
        type: editingTransaction.type,
        amount: editingTransaction.amount,
        paymentMethod: editingTransaction.paymentMethod,
        description: editingTransaction.description,
      });
    } else {
      form.reset({
        type: 'sale',
        amount: 0,
        paymentMethod: 'cash',
        description: '',
      });
    }
  }, [editingTransaction, form, isTransactionSheetOpen]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    try {
        if(editingTransaction) {
            updateTransaction({ ...editingTransaction, ...values });
            toast({ title: "Success", description: "Transaction updated." });
        } else {
            addTransaction(values);
            toast({ title: "Success", description: "Transaction added." });
        }
      toggleTransactionSheet(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Could not save transaction.",
        variant: "destructive",
      });
    }
  };
  
  const currentDescription = form.watch('description');
  const pastDescriptions = React.useMemo(() => transactions.map(t => t.description), [transactions]);

  return (
    <Sheet open={isTransactionSheetOpen} onOpenChange={(open) => toggleTransactionSheet(open)}>
      <SheetContent side="bottom" className="rounded-t-lg sm:max-w-2xl sm:mx-auto h-[75vh] flex flex-col">
        <SheetHeader>
          <SheetTitle>{editingTransaction ? 'Edit Transaction' : 'Create Transaction'}</SheetTitle>
          <SheetDescription>
            {editingTransaction ? 'Update the details of your transaction.' : 'Add a new sale or expense to your daily log.'}
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 px-1">
                <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select transaction type" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="sale">Sale</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="transfer">Transfer</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. Sale of 2x T-shirts" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <DescriptionSuggester 
                    currentDescription={currentDescription}
                    pastTransactions={pastDescriptions}
                    onSuggestionSelect={(suggestion) => form.setValue('description', suggestion)}
                />
                
                <SheetFooter className="pt-4 bg-background sticky bottom-0">
                <SheetClose asChild>
                    <Button variant="outline">Cancel</Button>
                </SheetClose>
                <Button type="submit">Save Transaction</Button>
                </SheetFooter>
            </form>
            </Form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
