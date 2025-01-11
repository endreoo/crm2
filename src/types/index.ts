export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  role?: string;
  lastContact?: Date;
  hotelId?: string;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  address: string;
  city: string;
  country: string;
  capacity?: number;
  rooms: number;
  rating: number;
  status: string;
  amenities: string[];
  image: string;
  google_number_of_reviews?: number;
  google_review_score?: number;
  segment?: string;
  sales_process?: string;
}

export interface Booking {
  id: string;
  hotelId: string;
  guestId: string;
  guestName: string;
  hotelName: string;
  checkIn: Date;
  checkOut: Date;
  roomType: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  totalAmount: number;
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationality?: string;
  preferences?: string[];
  vipStatus?: boolean;
  hotelId?: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  assignedTo?: string;
  bookingId?: string;
  hotelId?: string;
}

export interface ViewProps {
  hotelId?: string;
  bookingId?: string;
  guestId?: string;
  contactId?: string;
  ticketId?: string;
  variant?: 'grid' | 'list';
}