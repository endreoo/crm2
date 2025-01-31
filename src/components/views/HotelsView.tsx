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
  const [filterLoading, setFilterLoading] = useState(false);
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
  const [filteredLocations, setFilteredLocations] = useState<string[]>([]);
  const [allLocations, setAllLocations] = useState<string[]>([]);

  // Fetch all locations when component mounts
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locations = await api.hotels.getAllLocations();
        setAllLocations(locations);
        setFilteredLocations(locations);
      } catch (error) {
        console.error('Failed to fetch locations:', error);
      }
    };
    fetchLocations();
  }, []);

  // Initialize filtered locations when locations change
  useEffect(() => {
    setFilteredLocations(allLocations);
  }, [allLocations]);

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
      setFilterLoading(true);
      setError(null);

      if (!auth.isAuthenticated()) {
        await auth.login('admin@hotelonline.co', 'admin123');
      }

      // Send filters to API
      const response = await api.hotels.getAll(pageNum, pageSize, {
        field: sortField,
        order: sortOrder
      }, {
        location: locationFilter !== ALL_VALUES.location ? locationFilter : undefined,
        segment: segmentFilter !== ALL_VALUES.segment ? segmentFilter : undefined,
        sales_process: salesProcessFilter !== ALL_VALUES.process ? salesProcessFilter : undefined,
        search: searchTerm || undefined
      });
      
      console.log(`Loaded hotels page ${pageNum}:`, {
        filters: {
          location: locationFilter,
          segment: segmentFilter,
          sales_process: salesProcessFilter,
          search: searchTerm
        },
        sort: { field: sortField, order: sortOrder }
      });
      
      setHotels(response.data);
      setFilteredHotels(response.data);
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
      setFilterLoading(false);
    }
  }, [pageSize, locationFilter, segmentFilter, salesProcessFilter, searchTerm, sortField, sortOrder]);

  // Add sort function
  const handleSort = (field: HotelSortOptions['field']) => {
    console.log('Sorting by:', field);
    const newOrder: HotelSortOptions['order'] = field === sortField && sortOrder === 'asc' ? 'desc' : 'asc';
    
    // Update sort state
    setSortField(field);
    setSortOrder(newOrder);
    
    // Reset page and fetch data
    setPage(1);
    
    console.log('New sort state:', { field, order: newOrder });
  };

  // Update effect to refetch when filters or sort changes
  useEffect(() => {
    console.log('Filters or sort changed, fetching new data');
    setPage(1);
    fetchHotels(1, false);
  }, [locationFilter, segmentFilter, salesProcessFilter, searchTerm, pageSize, sortField, sortOrder]);

  // Remove the local filtering effect since filtering is now handled by the API
  useEffect(() => {
    setFilteredHotels(hotels);
  }, [hotels]);

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
              disabled={filterLoading}
            />
          </div>
          <Select 
            value={locationFilter} 
            onValueChange={setLocationFilter}
            disabled={filterLoading}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by location" />
              {filterLoading && (
                <div className="absolute right-8 top-1/2 -translate-y-1/2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                </div>
              )}
            </SelectTrigger>
            <SelectContent>
              <div className="p-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search locations..."
                    className="pl-8"
                    onChange={(e) => {
                      const searchValue = e.target.value.toLowerCase();
                      const filtered = allLocations.filter(loc => 
                        loc.toLowerCase().includes(searchValue)
                      );
                      setFilteredLocations(filtered);
                    }}
                  />
                </div>
              </div>
              <SelectItem value={ALL_VALUES.location}>All locations</SelectItem>
              {(filteredLocations.length > 0 ? filteredLocations : allLocations).map((location: string) => (
                <SelectItem key={location} value={location}>{location}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select 
            value={segmentFilter} 
            onValueChange={setSegmentFilter}
            disabled={filterLoading}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by segment" />
              {filterLoading && (
                <div className="absolute right-8 top-1/2 -translate-y-1/2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                </div>
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUES.segment}>All segments</SelectItem>
              {segments.map((segment: string) => (
                <SelectItem key={segment} value={segment}>{segment}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select 
            value={salesProcessFilter} 
            onValueChange={setSalesProcessFilter}
            disabled={filterLoading}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by sales process" />
              {filterLoading && (
                <div className="absolute right-8 top-1/2 -translate-y-1/2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                </div>
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUES.process}>All processes</SelectItem>
              {salesProcesses.map((process: string) => (
                <SelectItem key={process} value={process}>{process}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button disabled={filterLoading}>
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
            <div className="rounded-md border relative">
              {filterLoading && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p className="text-sm text-muted-foreground">Updating results...</p>
                  </div>
                </div>
              )}
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
                      className="cursor-pointer hover:bg-muted/50 w-[150px]"
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
                      <TableCell className="w-[150px]">
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