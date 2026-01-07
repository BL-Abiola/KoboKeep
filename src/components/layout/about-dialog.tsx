'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { Github } from 'lucide-react';
import Link from 'next/link';

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AboutDialog({ open, onOpenChange }: AboutDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline">About Kobokeep</DialogTitle>
          <DialogDescription>
            A simple bookkeeping app for small businesses.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 text-sm text-foreground">
          <div>
            <h3 className="font-semibold">Purpose</h3>
            <p className="text-muted-foreground">
              A simple bookkeeping app that helps small business owners track sales, expenses, and debts.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Built with</h3>
            <p className="text-muted-foreground">
              Next.js, React, ShadCN, and Tailwind CSS.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Author</h3>
            <p className="text-muted-foreground">Firebase Team</p>
          </div>
          <div>
            <h3 className="font-semibold">Source Code</h3>
            <Button variant="outline" asChild>
              <Link href="https://github.com/firebase/studio-apps/tree/main/isuna" target="_blank">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
