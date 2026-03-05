
"use client"

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Printer } from '@/types/printer';
import { AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReportBrokenDialogProps {
  printer: Printer;
  onReport: (reason: string) => void;
}

export function ReportBrokenDialog({ printer, onReport }: ReportBrokenDialogProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const { toast } = useToast();

  const handleConfirm = () => {
    if (!reason.trim()) {
      toast({
        variant: "destructive",
        title: "Description Required",
        description: "Please describe what is wrong with the printer.",
      });
      return;
    }

    onReport(reason);
    toast({
      title: "Printer Flagged",
      description: `${printer.name} is now offline for maintenance.`,
    });
    setOpen(false);
    setReason('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="px-3 border-destructive/30 hover:bg-destructive hover:text-white transition-colors">
          <AlertTriangle className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-headline flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-destructive" />
            Report Issue
          </DialogTitle>
          <DialogDescription>
            Help us maintain the lab. Describe the malfunction clearly for the admin staff.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="broken-desc">Problem Description</Label>
            <Textarea 
              id="broken-desc" 
              placeholder="e.g. Bed leveling sensor failed, loud clicking from extruder..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="destructive" onClick={handleConfirm}>Report Malfunction</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
