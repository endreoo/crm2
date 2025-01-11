import { ViewProps, Guest } from '@/types';
import { api } from '@/lib/api';
import { useState, useEffect } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import GuestDetailsDialog from './GuestDetailsDialog';

export default function GuestsView({ hotelId }: ViewProps) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchGuests = async () => {
    try {
      setLoading(true);
      const response = await api.guests.getAll();
      const filteredGuests = hotelId
        ? response.filter(guest => guest.hotelId === hotelId)
        : response;
      setGuests(filteredGuests);
      setError(null);
    } catch (err) {
      setError('Failed to fetch guests. Please try again.');
      console.error('Error fetching guests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, [hotelId]);

  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Nationality</TableHead>
              <TableHead>VIP Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/50 bg-destructive/10 p-8">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="mt-2 font-medium text-destructive">{error}</p>
        <Button onClick={fetchGuests} variant="outline" className="mt-4">
          <RefreshCcw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Nationality</TableHead>
            <TableHead>VIP Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.map((guest) => (
            <TableRow 
              key={guest.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setSelectedGuest(guest)}
            >
              <TableCell>{guest.name}</TableCell>
              <TableCell>{guest.email}</TableCell>
              <TableCell>{guest.phone}</TableCell>
              <TableCell>{guest.nationality || 'N/A'}</TableCell>
              <TableCell>
                <Badge variant={guest.vipStatus ? 'default' : 'secondary'}>
                  {guest.vipStatus ? 'VIP' : 'Regular'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <GuestDetailsDialog
        guest={selectedGuest}
        open={!!selectedGuest}
        onOpenChange={(open) => !open && setSelectedGuest(null)}
      />
    </div>
  );
}