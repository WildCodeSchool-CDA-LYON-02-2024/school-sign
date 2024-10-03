import { useRef, useState } from "react";
import { LessonCalendar } from "@/components/calendar/lesson/LessonCalendar";
import { LessonModal } from "@/components/calendar/lesson/LessonModal";
import { useLessonData } from "@/hooks/useLessonData";
import { useToast } from "@/hooks/use-toast";
import FullCalendar from "@fullcalendar/react";

export interface Lesson {
  id: number;
  name: string;
  dateStart: string;
  dateEnd: string;
  classID?: number;
}

export default function Calendar() {
  const calendarRef = useRef<FullCalendar>(null);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Lesson>({
    id: 0,
    name: "",
    dateStart: "",
    dateEnd: "",
  });
  const { toast } = useToast();
  const { events, addLesson } = useLessonData(toast);

  const handleDateClick = (arg: { dateStr: string }) => {
    setNewEvent({
      ...newEvent,
      dateStart: new Date(arg.dateStr).toISOString(),
      dateEnd: new Date(
        new Date(arg.dateStr).getTime() + 60 * 60 * 1000,
      ).toISOString(),
    });
    setShowModal(true);
  };

  const handleModalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const createdLesson = await addLesson(newEvent);
      console.log(createdLesson);
      if (calendarRef.current) {
        calendarRef.current.getApi().addEvent({
          name: createdLesson.name,
          dateStart: createdLesson.dateStart,
          dateEnd: createdLesson.dateEnd,
        });
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error adding lesson:", error);
    }
  };

  return (
    <>
      <LessonCalendar
        events={events}
        handleDateClick={handleDateClick}
        calendarRef={calendarRef}
      />
      {showModal && (
        <LessonModal
          open={showModal}
          newEvent={newEvent}
          setNewEvent={setNewEvent}
          handleModalSubmit={handleModalSubmit}
          setShowModal={setShowModal}
        />
        //     <EventDialog
        //     event={newEvent}
        //   open={showModal}
        //   onClose={handleCloseModal}
        //   onEventUpdate={onEventUpdate}
        // />
      )}
    </>
  );
}
