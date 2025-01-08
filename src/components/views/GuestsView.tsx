import { Plus, Search, Star } from 'lucide-react';
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
import GuestDetailsDialog from './GuestDetailsDialog';

interface GuestsViewProps {
  hotelId?: string;
  variant?: 'list' | 'grid';
}

export default function GuestsView({ hotelId, variant = 'grid' }: GuestsViewProps) {
  const [selectedGuest, setSelectedGuest] = useState<any>(null);

  // Placeholder data - will be replaced with API data
  const guests = [
    {
      id: '1',
      name: 'Emma Thompson',
      email: 'emma@example.com',
      phone: '+1 234 567 892',
      nationality: 'United States',
      preferences: ['Non-smoking', 'High floor'],
      vipStatus: true,
    },
    {
      id: '2',
      name: 'Carlos Rodriguez',
      email: 'carlos@example.com',
      phone: '+1 234 567 893',
      nationality: 'Spain',
      preferences: ['King bed', 'Airport transfer'],
      vipStatus: false,
    },
  ];

  const filteredGuests = hotelId 
    ? guests.filter(guest => guest.hotelId === hotelId)
    : guests;

  return (
    <div className="space-y-6">
      {!hotelId && <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search guests..."
              className="w-[300px] pl-9"
            />
          </div>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Guest
        </Button>
      </div>}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guest</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Nationality</TableHead>
              <TableHead>Preferences</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guests.map((guest) => (
              <TableRow 
                key={guest.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => setSelectedGuest(guest)}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    {guest.name}
                    {guest.vipStatus && (
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div>{guest.email}</div>
                    <div className="text-sm text-muted-foreground">
                      {guest.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{guest.nationality}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {guest.preferences.map((pref) => (
                      <Badge key={pref} variant="outline">
                        {pref}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {guest.vipStatus ? (
                    <Badge className="bg-yellow-500/15 text-yellow-700 dark:text-yellow-400">
                      VIP
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Regular</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <GuestDetailsDialog
        guest={selectedGuest}
        open={!!selectedGuest}
        onOpenChange={(open) => !open && setSelectedGuest(null)}
      />
    </div>
  );
}