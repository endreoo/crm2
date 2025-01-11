import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import HotelsView from './components/views/HotelsView';
import ContactsView from './components/views/ContactsView';
import BookingsView from './components/views/BookingsView';
import TicketsView from './components/views/TicketsView';
import SettingsView from './components/views/SettingsView';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <HotelsView />,
      },
      {
        path: '/hotels',
        element: <HotelsView />,
      },
      {
        path: '/contacts',
        element: <ContactsView />,
      },
      {
        path: '/bookings',
        element: <BookingsView />,
      },
      {
        path: '/tickets',
        element: <TicketsView />,
      },
      {
        path: '/settings',
        element: <SettingsView />,
      },
    ],
  },
]); 