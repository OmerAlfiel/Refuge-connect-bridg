import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Mail, Phone, ExternalLink, User, Building } from 'lucide-react';
import { Announcement } from '@/types';
import { format, parseISO } from 'date-fns';

interface AnnouncementDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  announcement: Announcement | null;
  getCategoryBadgeColor: (category: string) => string;
}

export const AnnouncementDetailsDialog: React.FC<AnnouncementDetailsDialogProps> = ({
  isOpen,
  onClose,
  announcement,
  getCategoryBadgeColor
}) => {
  if (!announcement) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{announcement.title}</DialogTitle>
            {announcement.important && (
              <Badge variant="destructive">Important</Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge className={getCategoryBadgeColor(announcement.category)}>
              {announcement.category}
            </Badge>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {announcement.region}
            </span>
            {announcement.eventDate && (
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(parseISO(announcement.eventDate), 'PPP')}
              </span>
            )}
          </div>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="prose prose-sm max-w-none">
            <p className="text-base leading-relaxed whitespace-pre-wrap">{announcement.content}</p>
          </div>
          
          {/* Posted by information */}
          <div className="mt-8 border-t pt-4">
            <h3 className="text-lg font-medium mb-3">Contact Information</h3>
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-primary-foreground font-medium">
                  {announcement.postedBy.name ? announcement.postedBy.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{announcement.postedBy.name || 'Unknown'}</span>
                    {announcement.postedBy.role === 'admin' && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">Admin</span>
                    )}
                    {announcement.postedBy.role === 'ngo' && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">NGO</span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Posted on {format(parseISO(announcement.createdAt), 'PPP')}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 mt-4">
                {announcement.postedBy.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${announcement.postedBy.email}`} className="text-sm hover:underline">
                      {announcement.postedBy.email}
                    </a>
                  </div>
                )}
                
                {announcement.postedBy.contact && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${announcement.postedBy.contact}`} className="text-sm hover:underline">
                      {announcement.postedBy.contact}
                    </a>
                  </div>
                )}
                
                {announcement.postedBy.organizationName && (
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{announcement.postedBy.organizationName}</span>
                  </div>
                )}
                
                {announcement.postedBy.website && (
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={announcement.postedBy.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:underline"
                    >
                      {announcement.postedBy.website}
                    </a>
                  </div>
                )}
                
                {!announcement.postedBy.email && !announcement.postedBy.contact && !announcement.postedBy.website && (
                  <div className="text-sm text-muted-foreground">
                    No contact information provided.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="mt-6">
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};