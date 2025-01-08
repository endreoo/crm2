import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Hotel,
  Building2,
  Users,
  CalendarDays,
  UserCircle,
  Ticket,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import HotelsView from '@/components/views/HotelsView';
import ContactsView from '@/components/views/ContactsView';
import BookingsView from '@/components/views/BookingsView';
import GuestsView from '@/components/views/GuestsView';
import TicketsView from '@/components/views/TicketsView';

type View = 'hotels' | 'contacts' | 'bookings' | 'guests' | 'tickets';

export default function Dashboard() {
  const [view, setView] = useState<View>('hotels');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigation = [
    { name: 'Hotels', icon: Hotel, view: 'hotels' as View },
    { name: 'Contacts', icon: Users, view: 'contacts' as View },
    { name: 'Bookings', icon: CalendarDays, view: 'bookings' as View },
    { name: 'Guests', icon: UserCircle, view: 'guests' as View },
    { name: 'Tickets', icon: Ticket, view: 'tickets' as View },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r shadow-sm transition-transform duration-200 ease-in-out',
          !isSidebarOpen && '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b bg-white px-6">
          <div className="flex items-center gap-2">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 25h5v-5h-5v5zm0-10h5v-5h-5v5zm20-10h-5v5h5v-5zm0 10h-5v5h5v-5z" fill="#00BCD4"/>
              <path d="M25 35h5v-5h-5v5zm-10 0h5v-5h-5v5z" fill="#00BCD4"/>
              <path d="M30 10h-5v5h5v-5zm-15 0h-5v5h5v-5z" fill="#00BCD4"/>
            </svg>
            <span className="text-lg font-semibold text-[#00BCD4]">HotelOnline</span>
          </div>
        </div>
        <nav className="space-y-1 px-3 py-4">
          {navigation.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 text-gray-600 hover:text-gray-900",
                view === item.view && "bg-gray-100 text-gray-900"
              )}
              onClick={() => setView(item.view)}
            >
              <item.icon className="h-5 w-5 text-gray-500" />
              {item.name}
            </Button>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div
        className={cn(
          'transition-margin duration-200 ease-in-out bg-white',
          isSidebarOpen ? 'ml-64' : 'ml-0'
        )}
      >
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-white px-6">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600 hover:text-gray-900"
            className="text-gray-600 hover:text-gray-900"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">
            {navigation.find((item) => item.view === view)?.name}
          </h1>
        </div>

        {/* View content */}
        <main className="p-6">
          {view === 'hotels' && <HotelsView />}
          {view === 'contacts' && <ContactsView />}
          {view === 'bookings' && <BookingsView />}
          {view === 'guests' && <GuestsView />}
          {view === 'tickets' && <TicketsView />}
        </main>
      </div>
    </div>
  );
}