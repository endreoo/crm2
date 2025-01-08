import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ticket } from '@/types';
import { Building2, CalendarDays, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import BookingsView from './BookingsView';
import HotelsView from './HotelsView';
import GuestsView from './GuestsView';

interface TicketDetailsDialogProps {
  ticket: Ticket | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TicketDetailsDialog({
  ticket,
  open,
  onOpenChange,
}: TicketDetailsDialogProps) {
  if (!ticket) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-500/15 text-blue-700 dark:text-blue-400';
      case 'in-progress':
        return 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400';
      case 'resolved':
        return 'bg-green-500/15 text-green-700 dark:text-green-400';
      default:
        return '';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/15 text-red-700 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400';
      case 'low':
        return 'bg-green-500/15 text-green-700 dark:text-green-400';
      default:
        return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center justify-between">
              <span>{ticket.title}</span>
              <div className="flex gap-2">
                <Badge className={getStatusColor(ticket.status)}>
                  {ticket.status}
                </Badge>
                <Badge className={getPriorityColor(ticket.priority)}>
                  {ticket.priority}
                </Badge>
              </div>
            </div>
          </DialogTitle>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                {ticket.createdAt.toLocaleDateString()}
              </div>
              {ticket.bookingId && (
                <div className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  Booking: {ticket.bookingId}
                </div>
              )}
            </div>
            {ticket.assignedTo && (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback>
                    {ticket.assignedTo
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <span>{ticket.assignedTo}</span>
              </div>
            )}
          </div>
          <p className="mt-2 text-sm">{ticket.description}</p>
        </DialogHeader>

        <Tabs defaultValue="hotel" className="mt-6">
          <TabsList>
            <TabsTrigger value="hotel">Hotel</TabsTrigger>
            <TabsTrigger value="booking">Booking</TabsTrigger>
            <TabsTrigger value="guest">Guest</TabsTrigger>
          </TabsList>
          <TabsContent value="hotel" className="mt-4">
            <div className="rounded-md border">
              <HotelsView ticketId={ticket.id} variant="list" />
            </div>
          </TabsContent>
          <TabsContent value="booking" className="mt-4">
            <div className="rounded-md border">
              <BookingsView ticketId={ticket.id} variant="list" />
            </div>
          </TabsContent>
          <TabsContent value="guest" className="mt-4">
            <div className="rounded-md border">
              <GuestsView ticketId={ticket.id} variant="list" />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}