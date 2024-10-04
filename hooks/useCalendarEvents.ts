import { useState } from "react";
import { Lesson } from "@/components/calendar/Calendar";
import { useLessonData } from "@/hooks/useLessonData";
import { useToast } from "@/hooks/use-toast";
import { SubmitHandler } from "react-hook-form";
import { DateClickArg } from "@fullcalendar/interaction";
import { LessonFormValues } from "@/components/calendar/lesson/LessonModal";

export function useCalendarEvents() {
  const [allEvents, setAllEvents] = useState<Lesson[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Lesson>({
    id: 0,
    name: "New Lesson",
    dateStart: "",
    dateEnd: "",
  });
  const { toast } = useToast();
  const { addLesson } = useLessonData();

  const handleDateClick = (arg: DateClickArg): void => {
    const startDate = new Date(arg.date);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour later

    setNewEvent({
      ...newEvent,
      name: "New Lesson",
      dateStart: startDate.toISOString(),
      dateEnd: endDate.toISOString(),
    });
    setShowModal(true);
  };

  // const addEvent = (data: Lesson) => {
  //   const event = {
  //     ...newEvent,
  //     id: new Date().getTime(),
  //     dateStart: new Date(data.dateStart).toISOString(),
  //     dateEnd: new Date(
  //       new Date(data.dateEnd).getTime() + 60 * 60 * 1000,
  //     ).toISOString(),
  //   };
  //   setAllEvents([...allEvents, event]);
  // };

  // const handleModalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   try {
  //     const createdLesson = await addLesson(newEvent);
  //     console.log(createdLesson);
  //     if (calendarRef.current) {
  //       calendarRef.current.getApi().addEvent({
  //         name: createdLesson.name,
  //         dateStart: createdLesson.dateStart,
  //         dateEnd: createdLesson.dateEnd,
  //       });
  //     }
  //     setShowModal(false);
  //   } catch (error) {
  //     console.error("Error adding lesson:", error);
  //   }
  // };

  // e: React.FormEvent<HTMLFormElement>
  // SubmitHandler<{
  //   name: string;
  //   dateStart: string;
  //   dateEnd: string;
  //   classId?: number | undefined;
  // }>

  const handleModalSubmit: SubmitHandler<LessonFormValues> = async (
    data: LessonFormValues,
    event?: React.BaseSyntheticEvent,
  ) => {
    event?.preventDefault();

    try {
      const createdLesson = await addLesson(newEvent);

      // Add the new event to the calendar state
      setAllEvents([...allEvents, newEvent]);
      // Close the modal after submission
      // Reset the new event
      setNewEvent({
        id: 0,
        name: "New Lesson",
        dateStart: "",
        dateEnd: "",
      });

      setShowModal(false);
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
    setAllEvents,
    showModal,
    setShowModal,
    newEvent,
    setNewEvent,
    handleDateClick,
    handleModalSubmit,
    handleCloseModal,
    onEventUpdate,
  };
}
