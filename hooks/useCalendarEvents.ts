import { useState } from "react";
import { Lesson } from "@/components/calendar/Calendar";

export function useCalendarEvents(toast: any) {
  const [allEvents, setAllEvents] = useState<Lesson[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Lesson>({
    id: 0,
    name: "New Lesson",
    dateStart: "",
    dateEnd: "",
  });

  const handleDateClick = (arg: { date: string }) => {
    const startDate = new Date(arg.date);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour later

    setNewEvent({
      ...newEvent,
      id: new Date().getTime(),
      name: "New Lesson",
      dateStart: startDate.toISOString(),
      dateEnd: endDate.toISOString(),
    });
    setShowModal(true);
  };

  const addEvent = (data: Lesson) => {
    const event = {
      ...newEvent,
      id: new Date().getTime(),
      dateStart: new Date(data.dateStart).toISOString(),
      dateEnd: new Date(
        new Date(data.dateEnd).getTime() + 60 * 60 * 1000,
      ).toISOString(),
    };
    setAllEvents([...allEvents, event]);
  };

  const handleModalSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Add the new event to the calendar state
      setAllEvents([...allEvents, newEvent]);
      // Close the modal after submission
      setShowModal(false);
      // Reset the new event
      setNewEvent({
        id: 0,
        name: "New Lesson",
        dateStart: "",
        dateEnd: "",
      });

      toast({
        title: "Event added",
        description: `Event ${newEvent.name} added successfully!`,
      });
    } catch (e) {
      console.error("Error adding event:", e);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // setShowDeleteModal(false);
    // setIdToDelete(null);
  };

  const onEventUpdate = (updatedEvent: Lesson) => {
    setAllEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event,
      ),
    );
  };

  return {
    allEvents,
    showModal,
    newEvent,
    handleDateClick,
    addEvent,
    handleModalSubmit,
    handleCloseModal,
    onEventUpdate,
  };
}
