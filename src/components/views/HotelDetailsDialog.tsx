import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Hotel } from '@/types';
import { Building2, MapPin, Star, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import ContactsView from './ContactsView';
import BookingsView from './BookingsView';
import GuestsView from './GuestsView';
import TicketsView from './TicketsView';

interface HotelDetailsDialogProps {
  hotel: Hotel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function HotelDetailsDialog({
  hotel,
  open,
  onOpenChange,
}: HotelDetailsDialogProps) {
  if (!hotel) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <span>{hotel.name}</span>
              </div>
              <Badge variant="secondary">{hotel.status}</Badge>
            </div>
          </DialogTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {hotel.city}, {hotel.country}
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {hotel.rooms} Rooms
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              {hotel.rating}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="contacts" className="mt-6">
          <TabsList>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="guests">Guests</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
          </TabsList>
          <TabsContent value="contacts" className="mt-4">
            <div className="rounded-md border">
              <ContactsView hotelId={hotel.id} variant="list" />
            </div>
          </TabsContent>
          <TabsContent value="bookings" className="mt-4">
            <div className="rounded-md border">
              <BookingsView hotelId={hotel.id} variant="list" />
            </div>
          </TabsContent>
          <TabsContent value="guests" className="mt-4">
            <div className="rounded-md border">
              <GuestsView hotelId={hotel.id} variant="list" />
            </div>
          </TabsContent>
          <TabsContent value="tickets" className="mt-4">
            <div className="rounded-md border">
              <TicketsView hotelId={hotel.id} variant="list" />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}