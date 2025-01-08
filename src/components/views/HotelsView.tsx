import { Building2, MapPin, Plus, Search, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import HotelDetailsDialog from './HotelDetailsDialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';

const mockHotels = [
  {
    id: '1',
    name: 'Grand Plaza Hotel',
    type: 'Luxury Hotel',
    city: 'New York',
    country: 'USA',
    rooms: 200,
    rating: 4.8,
    status: 'Active'
  },
  {
    id: '2',
    name: 'Oceanview Resort',
    type: 'Beach Resort',
    city: 'Miami',
    country: 'USA',
    rooms: 150,
    rating: 4.5,
    status: 'Active'
  },
  {
    id: '3',
    name: 'Mountain Lodge',
    type: 'Boutique Hotel',
    city: 'Aspen',
    country: 'USA',
    rooms: 75,
    rating: 4.7,
    status: 'Maintenance'
  }
];

export default function HotelsView() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function fetchHotels() {
    // Simulate API delay
    setTimeout(() => {
      setHotels(mockHotels);
      setLoading(false);
    }, 1000);
  }

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchHotels();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search hotels..."
              className="w-[300px] pl-9"
            />
          </div>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Hotel
        </Button>
      </div>

      {loading ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hotel</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <div>
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="mt-1 h-3 w-24" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/50 bg-destructive/10 p-8">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="mt-2 font-medium text-destructive">{error}</p>
          <Button onClick={handleRetry} variant="outline" className="mt-4">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      ) : (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hotel</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hotels.map((hotel) => (
              <TableRow 
                key={hotel.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => setSelectedHotel(hotel)}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{hotel.name}</div>
                      <div className="text-sm text-muted-foreground">{hotel.type}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {hotel.city}, {hotel.country}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    {hotel.rooms} Rooms
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{hotel.rating}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{hotel.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      )}
      <HotelDetailsDialog
        hotel={selectedHotel}
        open={!!selectedHotel}
        onOpenChange={(open) => !open && setSelectedHotel(null)}
      />
    </div>
  );
}