import { Hotel, Contact, Booking, Guest, Ticket } from '@/types';
import { auth } from './auth';

const API_BASE_URL = 'https://apiservice.hotelonline.co';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  pages: number;
}

// Helper function to get headers with auth token
const getHeaders = () => {
  const token = auth.getToken();
  if (!token) {
    throw new Error('No authentication token available');
  }
  
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

// Transform API hotel data to match our interface
const transformHotel = (hotel: any): Hotel => ({
  id: hotel.id.toString(),
  name: hotel.name,
  location: hotel.location,
  address: hotel.address || hotel.sub_location || hotel.location,
  city: hotel.sub_location || hotel.location,
  country: hotel.country || 'Kenya',
  capacity: hotel.capacity || 0,
  rooms: hotel.rooms || 0,
  rating: hotel.google_review_score || 0,
  status: hotel.status || 'active',
  amenities: hotel.amenities || [],
  image: hotel.image || '',
  google_number_of_reviews: hotel.google_number_of_reviews || 0,
  google_review_score: hotel.google_review_score || 0,
  segment: hotel.segment || 'N/A',
  sales_process: hotel.sales_process || 'N/A',
});

// Transform API contact data to match our interface
const transformContact = (contact: any): Contact => ({
  id: contact.id.toString(),
  name: contact.name,
  email: contact.email,
  phone: contact.phone,
  company: contact.company,
  role: contact.role,
  lastContact: contact.lastContact ? new Date(contact.lastContact) : undefined,
  hotelId: contact.hotelId?.toString(),
});

// Transform API booking data to match our interface
const transformBooking = (booking: any): Booking => ({
  id: booking.id.toString(),
  hotelId: booking.hotelId?.toString(),
  guestId: booking.guestId?.toString(),
  guestName: booking.guestName || 'Unknown',
  hotelName: booking.hotelName || 'Unknown',
  checkIn: new Date(booking.checkIn),
  checkOut: new Date(booking.checkOut),
  roomType: booking.roomType || 'Standard',
  status: booking.status || 'pending',
  totalAmount: booking.totalAmount || 0,
});

// Transform API guest data to match our interface
const transformGuest = (guest: any): Guest => ({
  id: guest.id.toString(),
  name: guest.name,
  email: guest.email,
  phone: guest.phone,
  nationality: guest.nationality,
  preferences: guest.preferences || [],
  vipStatus: guest.vipStatus || false,
  hotelId: guest.hotelId?.toString(),
});

// Transform API ticket data to match our interface
const transformTicket = (ticket: any): Ticket => ({
  id: ticket.id.toString(),
  title: ticket.title,
  description: ticket.description,
  status: ticket.status || 'open',
  priority: ticket.priority || 'medium',
  createdAt: new Date(ticket.createdAt),
  assignedTo: ticket.assignedTo,
  bookingId: ticket.bookingId?.toString(),
  hotelId: ticket.hotelId?.toString(),
});

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (
  url: string, 
  options: RequestInit, 
  retries = 5,
  baseDelay = 2000
) => {
  let lastError: Error | null = null;
  
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : baseDelay * Math.pow(2, i);
        console.log(`Rate limited, waiting ${delay}ms before retry ${i + 1}/${retries}`);
        await wait(delay);
        continue;
      }

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${responseText}`);
      }

      try {
        return JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response:', responseText);
        throw new Error('Invalid response format from server');
      }
    } catch (error: any) {
      lastError = error;
      if (i === retries - 1) break;
      
      const jitter = Math.random() * 1000;
      const delay = baseDelay * Math.pow(2, i) + jitter;
      console.log(`Request failed, waiting ${Math.round(delay)}ms before retry ${i + 1}/${retries}...`);
      await wait(delay);
    }
  }
  
  throw lastError || new Error('Max retries reached');
};

// Add sorting interfaces
export interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}

export interface HotelSortOptions extends SortOptions {
  field: 'name' | 'location' | 'reviews' | 'rating';
}

// Map frontend sort fields to backend field names
const SORT_FIELD_MAP: Record<HotelSortOptions['field'], string> = {
  name: 'name',
  location: 'location',
  reviews: 'google_number_of_reviews',
  rating: 'google_review_score'
};

export const api = {
  hotels: {
    async getAllBatched(batchSize = 5, maxBatches = 10): Promise<Hotel[]> {
      try {
        if (!auth.isAuthenticated()) {
          await auth.login('admin@hotelonline.co', 'admin123');
        }

        // First get the total count with a minimal request
        const initial = await fetchWithRetry(
          `${API_BASE_URL}/api/hotels?page=1&limit=1`,
          { headers: getHeaders() }
        );

        const totalHotels = initial.total || 0;
        const batchCount = Math.min(maxBatches, Math.ceil(totalHotels / batchSize));
        const batches: Promise<PaginatedResponse<Hotel>>[] = [];

        // Create batch requests
        for (let i = 0; i < batchCount; i++) {
          const batchPromise = fetchWithRetry(
            `${API_BASE_URL}/api/hotels?page=${i + 1}&limit=${batchSize}`,
            { headers: getHeaders() }
          ).then(response => ({
            data: (response.data || []).map(transformHotel),
            total: response.total || 0,
            pages: response.pages || 1
          }));
          batches.push(batchPromise);
          
          // Add a small delay between batch requests
          if (i < batchCount - 1) {
            await wait(500);
          }
        }

        // Wait for all batches to complete
        const results = await Promise.all(batches);
        
        // Combine all hotel data
        return results.flatMap(result => result.data);
      } catch (error: any) {
        console.error('Error in getAllBatched hotels:', error);
        throw error;
      }
    },

    async getAll(page = 1, limit = 50, sort?: HotelSortOptions): Promise<PaginatedResponse<Hotel>> {
      try {
        if (!auth.isAuthenticated()) {
          await auth.login('admin@hotelonline.co', 'admin123');
        }

        const sortField = sort ? SORT_FIELD_MAP[sort.field] : undefined;
        const sortParams = sort ? `&sortBy=${sortField}&order=${sort.order}` : '';
        const url = `${API_BASE_URL}/api/hotels/sort?page=${page}&limit=${limit}${sortParams}`;

        console.log('Fetching hotels with URL:', url);

        const response = await fetchWithRetry(
          url,
          { 
            headers: getHeaders(),
            method: 'GET',
            cache: 'no-cache'
          }
        );

        if (!response || typeof response !== 'object') {
          throw new Error('Invalid response format from server');
        }

        return {
          data: (response.data || []).map(transformHotel),
          total: response.total || 0,
          pages: response.pages || 1
        };
      } catch (error: any) {
        console.error('Error in getAll hotels:', error);
        throw error;
      }
    },

    search: async (query: string, page = 1, limit = 10): Promise<PaginatedResponse<Hotel>> => {
      try {
        if (!auth.isAuthenticated()) {
          await auth.login('admin@hotelonline.co', 'admin123');
        }

        const data = await fetchWithRetry(
          `${API_BASE_URL}/api/hotels/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
          { headers: getHeaders() }
        );

        return {
          data: data.data.map(transformHotel),
          total: data.total,
          pages: data.pages
        };
      } catch (error) {
        console.error('Error searching hotels:', error);
        throw error;
      }
    }
  },
  contacts: {
    getAll: async (): Promise<Contact[]> => {
      try {
        if (!auth.isAuthenticated()) {
          await auth.login('admin@hotelonline.co', 'admin123');
        }

        const data = await fetchWithRetry(
          `${API_BASE_URL}/api/contacts`,
          { headers: getHeaders() }
        );

        return data.map(transformContact);
      } catch (error) {
        console.error('Error fetching contacts:', error);
        throw error;
      }
    }
  },
  bookings: {
    getAll: async (): Promise<Booking[]> => {
      try {
        if (!auth.isAuthenticated()) {
          await auth.login('admin@hotelonline.co', 'admin123');
        }

        const data = await fetchWithRetry(
          `${API_BASE_URL}/api/bookings`,
          { headers: getHeaders() }
        );

        return data.map(transformBooking);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        throw error;
      }
    }
  },
  guests: {
    getAll: async (): Promise<Guest[]> => {
      try {
        if (!auth.isAuthenticated()) {
          await auth.login('admin@hotelonline.co', 'admin123');
        }

        const data = await fetchWithRetry(
          `${API_BASE_URL}/api/guests`,
          { headers: getHeaders() }
        );

        return data.map(transformGuest);
      } catch (error) {
        console.error('Error fetching guests:', error);
        throw error;
      }
    }
  },
  tickets: {
    getAll: async (): Promise<Ticket[]> => {
      try {
        if (!auth.isAuthenticated()) {
          await auth.login('admin@hotelonline.co', 'admin123');
        }

        const data = await fetchWithRetry(
          `${API_BASE_URL}/api/tickets`,
          { headers: getHeaders() }
        );

        return data.map(transformTicket);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        throw error;
      }
    }
  }
}; 