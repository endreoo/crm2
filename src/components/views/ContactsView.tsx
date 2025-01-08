import { Plus, Search, Mail, Phone } from 'lucide-react';
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
import ContactDetailsDialog from './ContactDetailsDialog';

interface ContactsViewProps {
  hotelId?: string;
  variant?: 'list' | 'grid';
}

export default function ContactsView({ hotelId, variant = 'grid' }: ContactsViewProps) {
  const [selectedContact, setSelectedContact] = useState<any>(null);

  // Placeholder data - will be replaced with API data
  const contacts = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 234 567 890',
      company: 'Travel Corp',
      role: 'Travel Agent',
      lastContact: new Date('2024-03-15'),
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 234 567 891',
      company: 'Business Travel Ltd',
      role: 'Corporate Client',
      lastContact: new Date('2024-03-10'),
    },
  ];

  const filteredContacts = hotelId 
    ? contacts.filter(contact => contact.hotelId === hotelId)
    : contacts;

  return (
    <div className="space-y-6">
      {!hotelId && <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              className="w-[300px] pl-9"
            />
          </div>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </div>}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Last Contact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow 
                key={contact.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => setSelectedContact(contact)}
              >
                <TableCell className="font-medium">{contact.name}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {contact.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {contact.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{contact.company}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{contact.role}</Badge>
                </TableCell>
                <TableCell>
                  {contact.lastContact.toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <ContactDetailsDialog
        contact={selectedContact}
        open={!!selectedContact}
        onOpenChange={(open) => !open && setSelectedContact(null)}
      />
    </div>
  );
}