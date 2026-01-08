
'use client';
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { Sunrise } from 'lucide-react';
import { CURRENCIES } from '@/lib/constants';

export function StartDayDialog() {
  const [openingCash, setOpeningCash] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { startDay, settings } = useAppStore();
  const { toast } = useToast();
  
  const currencySymbol = CURRENCIES[settings.currency]?.symbol || '$';

  const handleStartDay = () => {
    const amount = parseFloat(openingCash);
    if (isNaN(amount) || amount < 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid opening cash amount.",
        variant: "destructive",
      });
      return;
    }
    startDay(amount);
    toast({
      title: "Day Started",
      description: "Your daily log has been successfully started.",
    });
    setOpeningCash('');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="rounded-full">Start Day</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader className="items-center text-center">
            <div className="rounded-full bg-primary/10 p-3 w-fit">
                <Sunrise className="h-8 w-8 text-primary" />
            </div>
          <DialogTitle className="text-2xl font-headline pt-2">Start Your Day</DialogTitle>
          <DialogDescription>
            Enter your opening cash balance to begin tracking for today.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="opening-cash" className="text-sm font-medium text-muted-foreground">
              Opening Cash Balance
          </Label>
          <div className="relative mt-2">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-muted-foreground sm:text-sm">{currencySymbol}</span>
            </div>
            <Input
                id="opening-cash"
                type="number"
                value={openingCash}
                onChange={(e) => setOpeningCash(e.target.value)}
                className="pl-7 text-lg h-12 rounded-full"
                placeholder="0.00"
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button onClick={handleStartDay} className="w-full rounded-full" size="lg">Confirm & Start Day</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
