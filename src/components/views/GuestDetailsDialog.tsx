import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Guest } from '@/types';
import { Mail, Phone, Star, Building2, CalendarDays, Ticket } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import BookingsView from './BookingsView';
import HotelsView from './HotelsView';
import TicketsView from './TicketsView';

interface GuestDetailsDialogProps {
  guest: Guest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function GuestDetailsDialog({
  guest,
  open,
  onOpenChange,
}: GuestDetailsDialogProps) {
  if (!guest) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>{guest.name}</span>
                {guest.vipStatus && (
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                )}
              </div>
              {guest.vipStatus ? (
                <Badge className="bg-yellow-500/15 text-yellow-700 dark:text-yellow-400">
                  VIP
                </Badge>
              ) : (
                <Badge variant="secondary">Regular</Badge>
              )}
            </div>
          </DialogTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              {guest.email}
            </div>
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              {guest.phone}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="hotels" className="mt-6">
          <TabsList>
            <TabsTrigger value="hotels">Hotels</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
          </TabsList>
          <TabsContent value="hotels" className="mt-4">
            <div className="rounded-md border">
              <HotelsView guestId={guest.id} variant="list" />
            </div>
          </TabsContent>
          <TabsContent value="bookings" className="mt-4">
            <div className="rounded-md border">
              <BookingsView guestId={guest.id} variant="list" />
            </div>
          </TabsContent>
          <TabsContent value="tickets" className="mt-4">
            <div className="rounded-md border">
              <TicketsView guestId={guest.id} variant="list" />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}