export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  role?: string;
  lastContact?: Date;
}

export interface Hotel {
  id: string;
  name: string;
  address: string;
  rating: number;
  rooms: number;
  amenities: string[];
  image: string;
}

export interface Booking {
  id: string;
  hotelId: string;
  guestId: string;
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
}