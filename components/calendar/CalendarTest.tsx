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

  const fetchLessons = async () => {
    try {
      const response = await fetch("/api/lessons");
      const data: Lesson[] = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des leçons :", error);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const handleDateClick = (arg: { dateStr: string }) => {
    setNewEvent({ ...newEvent, dateStart: arg.dateStr, dateEnd: arg.dateStr });
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
        dateClick={handleDateClick}
        ref={calendarRef}
        initialView="dayGridMonth"
        events={events.map((event) => ({
          title: event.name,
          start: event.dateStart,
          end: event.dateEnd,
        }))}
      />
      {showModal && (
        <div className="modal">
          <form onSubmit={handleModalSubmit}>
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
              value={newEvent.dateStart}
              onChange={(e) =>
                setNewEvent({ ...newEvent, dateStart: e.target.value })
              }
              required
            />
            <input
              type="datetime-local"
              value={newEvent.dateEnd}
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
