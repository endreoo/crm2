import { Plus, Search } from 'lucide-react';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useState } from 'react';
import TicketDetailsDialog from './TicketDetailsDialog';

interface TicketsViewProps {
  hotelId?: string;
  variant?: 'list' | 'grid';
}

export default function TicketsView({ hotelId, variant = 'grid' }: TicketsViewProps) {
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  // Placeholder data - will be replaced with API data
  const tickets = [
    {
      id: '1',
      title: 'Room Service Delay',
      description: 'Guest reported delayed room service delivery',
      status: 'open',
      priority: 'high',
      createdAt: new Date('2024-03-15T10:30:00'),
      assignedTo: 'Sarah Wilson',
      bookingId: 'B123',
    },
    {
      id: '2',
      title: 'AC Not Working',
      description: 'AC unit in room 304 needs maintenance',
      status: 'in-progress',
      priority: 'medium',
      createdAt: new Date('2024-03-14T15:45:00'),
      assignedTo: 'Mike Brown',
      bookingId: 'B124',
    },
  ];

  const filteredTickets = hotelId 
    ? tickets.filter(ticket => ticket.hotelId === hotelId)
    : tickets;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-500/15 text-blue-700 dark:text-blue-400';
      case 'in-progress':
        return 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400';
      case 'resolved':
        return 'bg-green-500/15 text-green-700 dark:text-green-400';
      default:
        return '';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/15 text-red-700 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400';
      case 'low':
        return 'bg-green-500/15 text-green-700 dark:text-green-400';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {!hotelId && <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
              className="w-[300px] pl-9"
            />
          </div>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Ticket
        </Button>
      </div>}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow
                key={ticket.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => setSelectedTicket(ticket)}
              >
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{ticket.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {ticket.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(ticket.status)}>
                    {ticket.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getPriorityColor(ticket.priority)}>
                    {ticket.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>
                        {ticket.assignedTo
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span>{ticket.assignedTo}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {ticket.createdAt.toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <TicketDetailsDialog
        ticket={selectedTicket}
        open={!!selectedTicket}
        onOpenChange={(open) => !open && setSelectedTicket(null)}
      />
    </div>
  );
}