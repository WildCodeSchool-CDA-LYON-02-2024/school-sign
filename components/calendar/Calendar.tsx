import { LessonCalendar } from "@/components/calendar/lesson/LessonCalendar";
import { LessonModal } from "@/components/calendar/lesson/LessonModal";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";

export interface Lesson {
  id: number;
  name: string;
  dateStart: string;
  dateEnd: string;
  classID?: number;
}

export default function Calendar() {
  const { showModal, setShowModal, handleDateClick } = useCalendarEvents();
  console.log("showModal: ", showModal);

  return (
    <>
      <LessonCalendar handleDateClick={handleDateClick} />
      {showModal && (
        <LessonModal open={showModal} setShowModal={setShowModal} />
      )}
    </>
  );
}
