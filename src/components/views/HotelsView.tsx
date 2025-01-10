import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, Building2, MapPin, Plus, RefreshCcw, Search, Star, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { api, HotelSortOptions } from '@/lib/api';
import { auth } from '@/lib/auth';
import { Hotel } from '@/types';
import HotelDetailsDialog from './HotelDetailsDialog';

interface ViewProps {
  variant?: 'grid' | 'list';
  bookingId?: string;
  contactId?: string;
  guestId?: string;
  ticketId?: string;
}

const ALL_VALUES = {
  location: 'all_locations',
  segment: 'all_segments',
  process: 'all_processes'
} as const;

const PAGE_SIZE_OPTIONS = [
  { value: '10', label: '10 per page' },
  { value: '20', label: '20 per page' },
  { value: '50', label: '50 per page' },
  { value: '100', label: '100 per page' }
] as const;

export default function HotelsView({ variant = 'grid' }: ViewProps) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalHotels, setTotalHotels] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState<string>(ALL_VALUES.location);
  const [segmentFilter, setSegmentFilter] = useState<string>(ALL_VALUES.segment);
  const [salesProcessFilter, setSalesProcessFilter] = useState<string>(ALL_VALUES.process);
  const [pageSize, setPageSize] = useState<number>(20);
  const [sortField, setSortField] = useState<HotelSortOptions['field']>('name');
  const [sortOrder, setSortOrder] = useState<HotelSortOptions['order']>('asc');

  // Extract unique values for filters
  const locations = useMemo(() => {
    const uniqueLocations = new Set(hotels.map(hotel => hotel.location));
    return Array.from(uniqueLocations).sort();
  }, [hotels]);

  const segments = useMemo(() => {
    const uniqueSegments = new Set(hotels.map(hotel => hotel.segment || 'N/A'));
    return Array.from(uniqueSegments).sort();
  }, [hotels]);

  const salesProcesses = useMemo(() => {
    const uniqueProcesses = new Set(hotels.map(hotel => hotel.sales_process || 'N/A'));
    return Array.from(uniqueProcesses).sort();
  }, [hotels]);

  const fetchHotels = useCallback(async (pageNum = 1, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      if (!auth.isAuthenticated()) {
        await auth.login('admin@hotelonline.co', 'admin123');
      }

      // Always fetch fresh data when sorting
      const response = await api.hotels.getAll(pageNum, pageSize, {
        field: sortField,
        order: sortOrder
      });
      
      console.log(`Loaded hotels page ${pageNum} with sort:`, { field: sortField, order: sortOrder });
      
      // Never append when sorting changes
      setHotels(response.data);
      setTotalPages(response.pages);
      setTotalHotels(response.total);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to fetch hotels. Please try again.';
      setError(errorMessage);
      console.error('Error fetching hotels:', {
        error: err,
        message: errorMessage,
        stack: err?.stack
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [pageSize, sortField, sortOrder]);

  // Add sort function
  const handleSort = (field: HotelSortOptions['field']) => {
    console.log('Sorting by:', field);
    const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    
    // Update sort state
    setSortField(field);
    setSortOrder(newOrder);
    
    // Reset page and trigger reload
    setPage(1);
    
    console.log('New sort state:', {
      field: field,
      order: newOrder
    });
  };

  // Refetch when sort or page size changes
  useEffect(() => {
    console.log('Fetching with sort:', { field: sortField, order: sortOrder });
    fetchHotels(1, false);
  }, [sortField, sortOrder, pageSize]);

  // Handle page changes
  const handleNextPage = useCallback(() => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchHotels(nextPage, false);
    }
  }, [page, totalPages, fetchHotels]);

  const handlePrevPage = useCallback(() => {
    if (page > 1) {
      const prevPage = page - 1;
      setPage(prevPage);
      fetchHotels(prevPage, false);
    }
  }, [page, fetchHotels]);

  // Helper function to render sort indicator
  const renderSortIndicator = (field: HotelSortOptions['field']) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
    }
    return sortOrder === 'asc' ? 
      <ArrowUp className="h-4 w-4 text-primary" /> : 
      <ArrowDown className="h-4 w-4 text-primary" />;
  };

  // Update filtering effect
  useEffect(() => {
    // Only apply local filters that aren't handled by the API
    let result = [...hotels];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(hotel => 
        hotel.name.toLowerCase().includes(search) ||
        hotel.location.toLowerCase().includes(search)
      );
    }

    if (locationFilter && locationFilter !== ALL_VALUES.location) {
      result = result.filter(hotel => hotel.location === locationFilter);
    }

    if (segmentFilter && segmentFilter !== ALL_VALUES.segment) {
      result = result.filter(hotel => (hotel.segment || 'N/A') === segmentFilter);
    }

    if (salesProcessFilter && salesProcessFilter !== ALL_VALUES.process) {
      result = result.filter(hotel => (hotel.sales_process || 'N/A') === salesProcessFilter);
    }

    setFilteredHotels(result);
  }, [hotels, searchTerm, locationFilter, segmentFilter, salesProcessFilter]);

  if (variant === 'list') {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hotel</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hotels.map((hotel) => (
              <TableRow 
                key={hotel.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedHotel(hotel)}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div className="font-medium">{hotel.name}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {hotel.location}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={hotel.status.toLowerCase() === 'active' ? 'default' : 'secondary'}>
                    {hotel.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search hotels..."
              className="w-[300px] pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUES.location}>All locations</SelectItem>
              {locations.map((location: string) => (
                <SelectItem key={location} value={location}>{location}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={segmentFilter} onValueChange={setSegmentFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by segment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUES.segment}>All segments</SelectItem>
              {segments.map((segment: string) => (
                <SelectItem key={segment} value={segment}>{segment}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={salesProcessFilter} onValueChange={setSalesProcessFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by sales process" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUES.process}>All processes</SelectItem>
              {salesProcesses.map((process: string) => (
                <SelectItem key={process} value={process}>{process}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Hotel
        </Button>
      </div>

      <div className="overflow-auto max-h-[calc(100vh-200px)]">
        {loading && !hotels.length ? (
          <div className="flex items-center justify-center p-8">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-sm text-muted-foreground">Loading hotels...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/50 bg-destructive/10 p-8">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="mt-2 font-medium text-destructive">{error}</p>
            <Button onClick={() => fetchHotels(page, false)} variant="outline" className="mt-4">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 w-[250px]"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-2">
                        Hotel Name
                        {renderSortIndicator('name')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 w-[200px]"
                      onClick={() => handleSort('location')}
                    >
                      <div className="flex items-center gap-2">
                        Location
                        {renderSortIndicator('location')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 w-[120px]"
                      onClick={() => handleSort('reviews')}
                    >
                      <div className="flex items-center gap-2">
                        Reviews
                        {renderSortIndicator('reviews')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 w-[120px]"
                      onClick={() => handleSort('rating')}
                    >
                      <div className="flex items-center gap-2">
                        Rating
                        {renderSortIndicator('rating')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="w-[150px]"
                    >
                      <div className="flex items-center gap-2">
                        Segment
                      </div>
                    </TableHead>
                    <TableHead 
                      className="w-[150px]"
                    >
                      <div className="flex items-center gap-2">
                        Sales Process
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHotels.map((hotel) => (
                    <TableRow 
                      key={hotel.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setSelectedHotel(hotel)}
                    >
                      <TableCell className="w-[250px]">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <div className="font-medium">{hotel.name}</div>
                        </div>
                      </TableCell>
                      <TableCell className="w-[200px]">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {hotel.location}
                        </div>
                      </TableCell>
                      <TableCell className="w-[120px]">{hotel.google_number_of_reviews || 'N/A'}</TableCell>
                      <TableCell className="w-[120px]">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-muted-foreground" />
                          {hotel.google_review_score || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell className="w-[150px]">{hotel.segment || 'N/A'}</TableCell>
                      <TableCell className="w-[150px]">
                        <Badge variant="secondary">
                          {hotel.sales_process || 'N/A'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {loadingMore && (
              <div className="flex justify-center py-4">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              </div>
            )}

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  Page {page} of {totalPages} (Total: {totalHotels} hotels)
                </div>
                <Select 
                  value={pageSize.toString()} 
                  onValueChange={(value) => setPageSize(parseInt(value))}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_SIZE_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={handlePrevPage}
                  disabled={page === 1 || loading}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNextPage}
                  disabled={page === totalPages || loading}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <HotelDetailsDialog
        hotel={selectedHotel}
        open={!!selectedHotel}
        onOpenChange={(open: boolean) => !open && setSelectedHotel(null)}
      />
    </div>
  );
}