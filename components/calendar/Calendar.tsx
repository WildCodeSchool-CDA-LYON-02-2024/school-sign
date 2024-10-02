import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLessonData } from "@/hooks/useLessonData";
import { LessonCalendar } from "@/components/calendar/lesson/LessonCalendar";
import { LessonModal } from "@/components/calendar/lesson/LessonModal";
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
          title: createdLesson.name,
          start: createdLesson.dateStart,
          end: createdLesson.dateEnd,
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
          newEvent={newEvent}
          setNewEvent={setNewEvent}
          handleModalSubmit={handleModalSubmit}
          setShowModal={setShowModal}
        />
      )}
    </>
  );
}
