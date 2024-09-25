import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

interface Lesson {
  id: number;
  name: string;
  dateStart: string;
  dateEnd: string;
}

export default function CalendarTest() {
  const calendarRef = useRef<FullCalendar>(null);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Lesson>({
    id: 0,
    name: "",
    dateStart: "",
    dateEnd: "",
  });
  const [events, setEvents] = useState<Lesson[]>([]);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch("/api/lessons");
        const data: Lesson[] = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des leçons :", error);
      }
    };
    fetchLessons();
  }, []);

  const handleDateClick = (arg: { dateStr: string }) => {
    setNewEvent({
      ...newEvent,
      dateStart: new Date(
        new Date(arg.dateStr).getTime() + 60 * 60 * 2000
      ).toISOString(),
      dateEnd: new Date(
        new Date(arg.dateStr).getTime() + 60 * 60 * 3000
      ).toISOString(),
    });
    setShowModal(true);
  };

  const handleModalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await addLesson(newEvent);
    setShowModal(false);
  };

  const addLesson = async (lesson: Lesson) => {
    try {
      const response = await fetch("/api/lessons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lesson),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de la leçon");
      }

      const createdLesson = await response.json();
      console.log("Leçon ajoutée avec succès :", createdLesson);

      if (calendarRef.current) {
        calendarRef.current.getApi().addEvent({
          title: createdLesson.name,
          start: createdLesson.dateStart,
          end: createdLesson.dateEnd,
        });
      }

      setEvents((prevEvents) => [...prevEvents, createdLesson]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
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
        dateClick={handleDateClick}
        ref={calendarRef}
        initialView="dayGridMonth"
        events={events.map((event) => ({
          title: event.name,
          start: new Date(event.dateStart).getTime() - 60 * 60 * 2000,
          end: new Date(event.dateEnd).getTime() - 60 * 60 * 2000,
        }))}
      />
      {showModal && (
        <div className="modal flex flex-col justify-center items-center">
          <form
            onSubmit={handleModalSubmit}
            className="flex flex-col justify-center items-center"
          >
            <input
              type="text"
              placeholder="Nom de la leçon"
              value={newEvent.name}
              onChange={(e) =>
                setNewEvent({ ...newEvent, name: e.target.value })
              }
              required
            />
            <input
              type="datetime-local"
              value={newEvent.dateStart?.slice(0, 16)}
              onChange={(e) =>
                setNewEvent({ ...newEvent, dateStart: e.target.value })
              }
              required
            />
            <input
              type="datetime-local"
              value={newEvent.dateEnd?.slice(0, 16)}
              onChange={(e) =>
                setNewEvent({ ...newEvent, dateEnd: e.target.value })
              }
              required
            />
            <button type="submit">Ajouter la leçon</button>
            <button type="button" onClick={() => setShowModal(false)}>
              Annuler
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
