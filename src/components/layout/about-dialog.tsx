'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { Github, Mail, Twitter } from 'lucide-react';
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
          <DialogTitle className="text-2xl font-headline">About KoboKeep</DialogTitle>
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
            <h3 className="font-semibold">Developer</h3>
            <p className="text-muted-foreground">Your Name</p>
          </div>
            <div>
            <h3 className="font-semibold">Contact</h3>
            <div className="flex gap-2 pt-1">
                <Button variant="outline" asChild size="sm">
                    <Link href="https://twitter.com/yourhandle" target="_blank">
                        <Twitter className="mr-2 h-4 w-4" />
                        Twitter
                    </Link>
                </Button>
                <Button variant="outline" asChild size="sm">
                    <Link href="mailto:youremail@example.com">
                        <Mail className="mr-2 h-4 w-4" />
                        Email
                    </Link>
                </Button>
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Source Code</h3>
            <Button variant="outline" asChild>
              <Link href="https://github.com/your-username/your-repo" target="_blank">
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
