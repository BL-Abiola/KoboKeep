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

export function StartDayDialog() {
  const [openingCash, setOpeningCash] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { startDay } = useAppStore();
  const { toast } = useToast();

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
        <Button size="lg">Start Day</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Start Your Day</DialogTitle>
          <DialogDescription>
            Enter your opening cash balance to begin tracking for today.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="opening-cash" className="text-right">
              Opening Cash
            </Label>
            <Input
              id="opening-cash"
              type="number"
              value={openingCash}
              onChange={(e) => setOpeningCash(e.target.value)}
              className="col-span-3"
              placeholder="0.00"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleStartDay}>Start Day</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
