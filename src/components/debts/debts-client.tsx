'use client';
import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Debt } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, MoreHorizontal, Edit, Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CURRENCIES } from '@/lib/constants';
import { formatDistanceToNow } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


const debtSchema = z.object({
  contactName: z.string().min(1, 'Contact name is required'),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  type: z.enum(['owed_to_me', 'i_owe']),
  notes: z.string().optional(),
});

function DebtForm({ debt, onFinished }: { debt?: Debt; onFinished: () => void }) {
  const { addDebt, updateDebt } = useAppStore();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof debtSchema>>({
    resolver: zodResolver(debtSchema),
    defaultValues: { contactName: '', amount: 0, type: 'owed_to_me', notes: '' },
  });

  useEffect(() => {
    if (debt) form.reset(debt);
  }, [debt, form]);

  const onSubmit = (values: z.infer<typeof debtSchema>) => {
    if (debt) {
      updateDebt({ ...debt, ...values });
      toast({ title: 'Debt updated' });
    } else {
      addDebt(values);
      toast({ title: 'Debt added' });
    }
    onFinished();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Form fields... */}
        <FormField control={form.control} name="contactName" render={({ field }) => ( <FormItem><FormLabel>Contact Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
        <FormField control={form.control} name="amount" render={({ field }) => ( <FormItem><FormLabel>Amount</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
        <FormField control={form.control} name="notes" render={({ field }) => ( <FormItem><FormLabel>Notes</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem> )} />
        <DialogFooter>
          <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}


function DebtCard({ debt }: { debt: Debt }) {
    const { settings, deleteDebt } = useAppStore();
    const currencySymbol = CURRENCIES[settings.currency]?.symbol || '$';
    const [isFormOpen, setIsFormOpen] = useState(false);

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>{debt.contactName}</CardTitle>
                            <CardDescription>
                                Last updated {formatDistanceToNow(new Date(debt.lastUpdated), { addSuffix: true })}
                            </CardDescription>
                        </div>
                         <AlertDialog>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onSelect={() => setIsFormOpen(true)}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem className="text-destructive focus:text-destructive"><Trash className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                                    </AlertDialogTrigger>
                                </DropdownMenuContent>
                            </DropdownMenu>
                             <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>This will permanently delete this debt record.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => deleteDebt(debt.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className={`text-2xl font-bold ${debt.type === 'owed_to_me' ? 'text-green-600' : 'text-red-600'}`}>
                        {currencySymbol}{debt.amount.toFixed(2)}
                    </p>
                    {debt.notes && <p className="text-sm text-muted-foreground mt-2">{debt.notes}</p>}
                </CardContent>
            </Card>
             <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Debt</DialogTitle>
                    </DialogHeader>
                    <DebtForm debt={debt} onFinished={() => setIsFormOpen(false)} />
                </DialogContent>
            </Dialog>
        </>
    );
}

export function DebtsClient() {
  const { debts, settings } = useAppStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState<'owed_to_me' | 'i_owe'>('owed_to_me');

  const debtsOwedToMe = debts.filter((d) => d.type === 'owed_to_me');
  const debtsIOwe = debts.filter((d) => d.type === 'i_owe');

  const totalOwedToMe = debtsOwedToMe.reduce((sum, d) => sum + d.amount, 0);
  const totalIOwe = debtsIOwe.reduce((sum, d) => sum + d.amount, 0);
  const currencySymbol = CURRENCIES[settings.currency]?.symbol || '$';

  const openForm = (type: 'owed_to_me' | 'i_owe') => {
    setFormType(type);
    setIsFormOpen(true);
  }

  return (
    <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Total Owed to You</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold text-green-600">{currencySymbol}{totalOwedToMe.toFixed(2)}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Total You Owe</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold text-red-600">{currencySymbol}{totalIOwe.toFixed(2)}</p>
                </CardContent>
            </Card>
        </div>

      <Tabs defaultValue="owed_to_me">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="owed_to_me">Owed to Me</TabsTrigger>
          <TabsTrigger value="i_owe">I Owe</TabsTrigger>
        </TabsList>
        <TabsContent value="owed_to_me">
            <div className="flex justify-end mb-4">
                <Button onClick={() => openForm('owed_to_me')}><PlusCircle className="mr-2 h-4 w-4" /> Add Debtor</Button>
            </div>
          {debtsOwedToMe.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {debtsOwedToMe.map((d) => <DebtCard key={d.id} debt={d} />)}
            </div>
          ) : (<p className="text-center text-muted-foreground py-8">No one owes you money right now.</p>)}
        </TabsContent>
        <TabsContent value="i_owe">
            <div className="flex justify-end mb-4">
                <Button onClick={() => openForm('i_owe')}><PlusCircle className="mr-2 h-4 w-4" /> Add Creditor</Button>
            </div>
          {debtsIOwe.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {debtsIOwe.map((d) => <DebtCard key={d.id} debt={d} />)}
            </div>
          ) : (<p className="text-center text-muted-foreground py-8">You don't owe anyone money right now.</p>)}
        </TabsContent>
      </Tabs>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{formType === 'owed_to_me' ? 'Add New Debtor' : 'Add New Creditor'}</DialogTitle>
            <DialogDescription>Track money owed to you or that you owe to others.</DialogDescription>
          </DialogHeader>
          <DebtForm onFinished={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
