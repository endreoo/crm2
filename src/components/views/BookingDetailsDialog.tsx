import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Booking } from '@/types';
import { Building2, Calendar, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import GuestsView from './GuestsView';
import HotelsView from './HotelsView';
import TicketsView from './TicketsView';

interface BookingDetailsDialogProps {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BookingDetailsDialog({
  booking,
  open,
  onOpenChange,
}: BookingDetailsDialogProps) {
  if (!booking) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/15 text-green-700 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400';
      case 'cancelled':
        return 'bg-red-500/15 text-red-700 dark:text-red-400';
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
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <span>Booking #{booking.id}</span>
              </div>
              <Badge className={getStatusColor(booking.status)}>
                {booking.status}
              </Badge>
            </div>
          </DialogTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {booking.checkIn.toLocaleDateString()} - {booking.checkOut.toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {booking.guestName}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="hotel" className="mt-6">
          <TabsList>
            <TabsTrigger value="hotel">Hotel</TabsTrigger>
            <TabsTrigger value="guest">Guest</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
          </TabsList>
          <TabsContent value="hotel" className="mt-4">
            <div className="rounded-md border">
              <HotelsView bookingId={booking.id} variant="list" />
            </div>
          </TabsContent>
          <TabsContent value="guest" className="mt-4">
            <div className="rounded-md border">
              <GuestsView variant="list" />
            </div>
          </TabsContent>
          <TabsContent value="tickets" className="mt-4">
            <div className="rounded-md border">
              <TicketsView variant="list" />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}