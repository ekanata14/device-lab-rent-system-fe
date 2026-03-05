
"use client"

import { UsageLog } from '@/types/printer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, Info, History } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

interface UsageLogsViewProps {
  logs: UsageLog[];
}

export function UsageLogsView({ logs }: UsageLogsViewProps) {
  if (logs.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed rounded-xl bg-card/30">
        <History className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
        <p className="text-muted-foreground">No usage history recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Printer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead>Proof</TableHead>
            <TableHead className="text-right">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{log.userName}</span>
                  <span className="text-[10px] text-muted-foreground">{log.studentId}</span>
                </div>
              </TableCell>
              <TableCell>{log.printerName}</TableCell>
              <TableCell>
                <Badge variant={
                  log.statusAtEnd === 'completed' ? 'default' : 
                  log.statusAtEnd === 'force-stopped' ? 'secondary' : 
                  'destructive'
                } className="text-[10px] uppercase">
                  {log.statusAtEnd.replace('-', ' ')}
                </Badge>
              </TableCell>
              <TableCell className="tabular-nums">{log.usageTime}m</TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {format(new Date(log.endTime), 'MMM d, HH:mm')}
              </TableCell>
              <TableCell>
                {log.photoUrl && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/20">
                        <ImageIcon className="w-4 h-4 text-primary" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0 border-primary/30">
                      <img src={log.photoUrl} alt="Session Proof" className="w-full h-auto" />
                      <div className="p-2 bg-muted text-[10px] italic">Photo captured at registration</div>
                    </PopoverContent>
                  </Popover>
                )}
              </TableCell>
              <TableCell className="text-right">
                {log.stopReason && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-3 text-sm">
                      <p className="font-semibold mb-1">Stop Reason:</p>
                      <p className="text-muted-foreground italic text-xs">"{log.stopReason}"</p>
                    </PopoverContent>
                  </Popover>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
