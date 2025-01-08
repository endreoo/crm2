import { Plus, Search, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import BookingDetailsDialog from './BookingDetailsDialog';

interface BookingsViewProps {
  hotelId?: string;
  variant?: 'list' | 'grid';
}

export default function BookingsView({ hotelId, variant = 'grid' }: BookingsViewProps) {
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  // Placeholder data - will be replaced with API data
  const bookings = [
    {
      id: '1',
      hotelName: 'Grand Plaza Hotel',
      guestName: 'Alice Johnson',
      checkIn: new Date('2024-03-20'),
      checkOut: new Date('2024-03-25'),
      roomType: 'Deluxe Suite',
      status: 'confirmed',
      totalAmount: 1200,
    },
    {
      id: '2',
      hotelName: 'Oceanview Resort',
      guestName: 'Bob Wilson',
      checkIn: new Date('2024-04-01'),
      checkOut: new Date('2024-04-05'),
      roomType: 'Ocean View Room',
      status: 'pending',
      totalAmount: 800,
    },
  ];

  const filteredBookings = hotelId 
    ? bookings.filter(booking => booking.hotelId === hotelId)
    : bookings;

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
    <div className="space-y-6">
      {!hotelId && <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search bookings..."
              className="w-[300px] pl-9"
            />
          </div>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Booking
        </Button>
      </div>}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hotel</TableHead>
              <TableHead>Guest</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Room Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow
                key={booking.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => setSelectedBooking(booking)}
              >
                <TableCell className="font-medium">
                  {booking.hotelName}
                </TableCell>
                <TableCell>{booking.guestName}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {booking.checkIn.toLocaleDateString()} -{' '}
                      {booking.checkOut.toLocaleDateString()}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{booking.roomType}</TableCell>
                <TableCell>${booking.totalAmount.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <BookingDetailsDialog
        booking={selectedBooking}
        open={!!selectedBooking}
        onOpenChange={(open) => !open && setSelectedBooking(null)}
      />
    </div>
  );
}