import {
  LayoutDashboard,
  Hotel,
  Users,
  Calendar,
  TicketIcon,
  Settings,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Hotels',
    href: '/hotels',
    icon: Hotel,
  },
  {
    name: 'Contacts',
    href: '/contacts',
    icon: Users,
  },
  {
    name: 'Bookings',
    href: '/bookings',
    icon: Calendar,
  },
  {
    name: 'Tickets',
    href: '/tickets',
    icon: TicketIcon,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export default function Dashboard() {
  return (
    <div className="flex w-72 flex-col gap-y-5 border-r bg-white px-6">
      <div className="flex h-16 shrink-0 items-center">
        <img
          className="h-8 w-auto"
          src="/logo.svg"
          alt="Hotel Online"
        />
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6',
                        isActive
                          ? 'bg-gray-50 font-semibold text-primary'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      )
                    }
                  >
                    <item.icon className="h-6 w-6 shrink-0" />
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}