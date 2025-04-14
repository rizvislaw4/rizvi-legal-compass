
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AppLayout from "@/components/layouts/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import CaseHearingForm from "@/components/calendar/CaseHearingForm";

type HearingEvent = {
  id: string;
  title: string;
  date: Date;
  caseId: string;
  caseTitle: string;
};

const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<HearingEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const { isAdmin, isLawyer } = useAuth();
  
  const canAddEvents = isAdmin || isLawyer;
  
  // Function to fetch events based on the selected month
  const fetchEvents = async (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    
    setIsLoading(true);
    try {
      // Calculate first and last day of the month
      const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      const lastDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
      
      // Format dates for Supabase query
      const startDate = firstDay.toISOString().split('T')[0];
      const endDate = lastDay.toISOString().split('T')[0];
      
      // Fetch cases with hearing dates in the selected month
      const { data, error } = await supabase
        .from('cases')
        .select(`
          id,
          title,
          next_hearing_date
        `)
        .gte('next_hearing_date', startDate)
        .lte('next_hearing_date', endDate);
      
      if (error) throw error;
      
      // Transform data to match our Event type
      const formattedEvents = data
        .filter(item => item.next_hearing_date) // Filter out cases without hearing dates
        .map((item) => ({
          id: item.id,
          title: `Hearing: ${item.title}`,
          date: new Date(item.next_hearing_date),
          caseId: item.id,
          caseTitle: item.title
        }));
      
      setEvents(formattedEvents);
    } catch (error: any) {
      toast.error(`Error fetching calendar events: ${error.message}`);
      console.error("Error fetching calendar events:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (date) {
      fetchEvents(date);
    }
  }, [date]);
  
  // Get events for the currently selected date
  const getEventsForDate = (selectedDate: Date | undefined) => {
    if (!selectedDate) return [];
    
    return events.filter(event => 
      event.date.getDate() === selectedDate.getDate() &&
      event.date.getMonth() === selectedDate.getMonth() &&
      event.date.getFullYear() === selectedDate.getFullYear()
    );
  };
  
  const selectedDateEvents = date ? getEventsForDate(date) : [];
  
  // Function to handle month change
  const handleMonthChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
    }
  };

  // Function to check if a date has events
  const hasEvents = (day: Date) => {
    return events.some(event => 
      event.date.getDate() === day.getDate() &&
      event.date.getMonth() === day.getMonth() &&
      event.date.getFullYear() === day.getFullYear()
    );
  };

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Calendar</h1>
        {canAddEvents && (
          <Button 
            onClick={() => setIsAddEventOpen(true)}
            className="bg-law-primary hover:bg-law-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Schedule Hearing
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Court Hearings Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                onMonthChange={handleMonthChange}
                className="rounded-md border p-3 pointer-events-auto"
                disabled={isLoading}
                modifiers={{
                  event: (date) => hasEvents(date)
                }}
                modifiersClassNames={{
                  event: "bg-law-primary text-white font-bold"
                }}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {date ? `Events for ${format(date, 'MMMM d, yyyy')}` : 'Select a date'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Loading events...</div>
            ) : selectedDateEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDateEvents.map(event => (
                  <div key={event.id} className="p-3 border rounded-md">
                    <h3 className="font-medium">{event.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Case: {event.caseTitle}
                    </p>
                    <div className="flex items-center text-sm mt-2">
                      <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                      {format(event.date, 'h:mm a')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No events scheduled for this day
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Add Event Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Hearing</DialogTitle>
          </DialogHeader>
          <CaseHearingForm 
            onSuccess={() => {
              setIsAddEventOpen(false);
              fetchEvents(date);
              toast.success("Hearing scheduled successfully");
            }}
            selectedDate={date}
          />
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default CalendarPage;
