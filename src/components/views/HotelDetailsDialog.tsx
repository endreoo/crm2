import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Hotel } from '@/types';
import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface HotelDetailsDialogProps {
  hotel: Hotel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function HotelDetailsDialog({
  hotel,
  open,
  onOpenChange,
}: HotelDetailsDialogProps) {
  if (!hotel) return null;

  const location = hotel.city && hotel.country 
    ? `${hotel.city}, ${hotel.country}`
    : hotel.location || hotel.address;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{hotel.name}</DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {location}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Reviews</h4>
              <p className="text-sm text-muted-foreground">
                {hotel.google_number_of_reviews || 'N/A'}
              </p>
            </div>
            <div>
              <h4 className="font-medium">Rating</h4>
              <p className="text-sm text-muted-foreground">
                {hotel.google_review_score || 'N/A'}
              </p>
            </div>
            <div>
              <h4 className="font-medium">Segment</h4>
              <p className="text-sm text-muted-foreground">
                {hotel.segment || 'N/A'}
              </p>
            </div>
            <div>
              <h4 className="font-medium">Sales Process</h4>
              <p className="text-sm text-muted-foreground">
                {hotel.sales_process || 'N/A'}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Amenities</h4>
            <div className="flex flex-wrap gap-2">
              {hotel.amenities.map((amenity) => (
                <Badge key={amenity} variant="secondary">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}