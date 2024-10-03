import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Lesson } from "@/components/calendar/Calendar";

interface LessonCalendarProps {
  events: Lesson[];
  handleDateClick: (arg: { dateStr: string }) => void;
  calendarRef: React.RefObject<FullCalendar>;
}

export function LessonCalendar({
  events,
  handleDateClick,
  calendarRef,
}: LessonCalendarProps) {
  return (
    <>
      <FullCalendar
        height={750}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        timeZone="Europe/Paris"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        eventTimeFormat={{
          hour: "numeric",
          minute: "2-digit",
          meridiem: false,
        }}
        locale="en-GB"
        firstDay={1}
        dateClick={handleDateClick}
        ref={calendarRef}
        initialView="dayGridMonth"
        events={events.map((event) => ({
          title: event.name,
          start: new Date(event.dateStart).toISOString(),
          end: new Date(event.dateEnd).toISOString(),
        }))}
        editable={true}
        selectable={true}
        selectMirror={true}
      />
    </>
  );
}
