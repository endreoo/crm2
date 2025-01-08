import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Contact } from '@/types';
import { Mail, Phone, Building2, CalendarDays, Ticket } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import BookingsView from './BookingsView';
import HotelsView from './HotelsView';
import TicketsView from './TicketsView';

interface ContactDetailsDialogProps {
  contact: Contact | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ContactDetailsDialog({
  contact,
  open,
  onOpenChange,
}: ContactDetailsDialogProps) {
  if (!contact) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>{contact.name}</span>
              </div>
              <Badge variant="secondary">{contact.role}</Badge>
            </div>
          </DialogTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              {contact.email}
            </div>
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              {contact.phone}
            </div>
            {contact.company && (
              <div className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                {contact.company}
              </div>
            )}
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
              <HotelsView contactId={contact.id} variant="list" />
            </div>
          </TabsContent>
          <TabsContent value="bookings" className="mt-4">
            <div className="rounded-md border">
              <BookingsView contactId={contact.id} variant="list" />
            </div>
          </TabsContent>
          <TabsContent value="tickets" className="mt-4">
            <div className="rounded-md border">
              <TicketsView contactId={contact.id} variant="list" />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}