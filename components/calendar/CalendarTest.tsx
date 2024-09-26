import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export interface Lesson {
  id: number;
  name: string;
  dateStart: Date; // Keep as Date
  dateEnd: Date;   // Keep as Date
  classId: number | null;
}

export default function CalendarTest() {
  const calendarRef = useRef<FullCalendar>(null);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Lesson>({
    id: 0,
    name: "",
    dateStart: new Date(), // Set default to now
    dateEnd: new Date(new Date().getTime() + 60 * 60 * 1000), // Default to 1 hour later
    classId: null,
  });
  const [events, setEvents] = useState<Lesson[]>([]);
  const [userClassId, setUserClassId] = useState<number | null>(null);

  // Fetch classId by token
  useEffect(() => {
    const fetchClassId = async () => {
      try {
        const response = await fetch("/api/getClassIdByToken");
        if (response.ok) {
          const data = await response.json();
          setUserClassId(data.user.classId);
        } else {
          console.error("Error fetching classId");
        }
      } catch (error) {
        console.error("Error fetching classId", error);
      }
    };

    fetchClassId();
  }, []);

  // Fetch lessons
  useEffect(() => {
    if (userClassId) {
      const fetchLessons = async () => {
        try {
          const response = await fetch(`/api/lessons?classId=${userClassId}`);
          if (response.ok) {
            const data: Lesson[] = await response.json();
            // Convert date strings to Date objects
            const lessonsWithDateObjects = data.map((lesson) => ({
              ...lesson,
              dateStart: new Date(lesson.dateStart), // Convert to Date
              dateEnd: new Date(lesson.dateEnd),     // Convert to Date
            }));
            setEvents(lessonsWithDateObjects);
          } else {
            console.error("Error fetching lessons");
          }
        } catch (error) {
          console.error("Error fetching lessons:", error);
        }
      };

      fetchLessons();
    }
  }, [userClassId]);

  // Handle date click event
  const handleDateClick = (arg: { dateStr: string }) => {
    setNewEvent({
      ...newEvent,
      dateStart: new Date(arg.dateStr), // Set directly as Date
      dateEnd: new Date(new Date(arg.dateStr).getTime() + 60 * 60 * 1000), // Default to 1 hour later
    });
    setShowModal(true);
  };

  // Handle modal submission
  const handleModalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addLesson(newEvent);
      setShowModal(false);
      resetNewEvent(); // Reset new event after submission
    } catch (error) {
      console.error("Error adding lesson:", error);
    }
  };

  // Add lesson to the server
  const addLesson = async (lesson: Lesson) => {
    try {
      const response = await fetch("/api/lessons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...lesson,
          dateStart: lesson.dateStart.toISOString(), // Convert Date back to string
          dateEnd: lesson.dateEnd.toISOString(),     // Convert Date back to string
        }),
      });

      if (!response.ok) {
        throw new Error("Error adding lesson");
      }

      const createdLesson = await response.json();
      console.log("Lesson added successfully:", createdLesson);

      if (calendarRef.current) {
        calendarRef.current.getApi().addEvent({
          title: createdLesson.name,
          start: createdLesson.dateStart,
          end: createdLesson.dateEnd,
        });
      }

      setEvents((prevEvents) => [...prevEvents, {
        ...createdLesson,
        dateStart: new Date(createdLesson.dateStart), // Convert to Date
        dateEnd: new Date(createdLesson.dateEnd),     // Convert to Date
      }]);
    } catch (error) {
      console.error(error);
      alert("Failed to add lesson. Please try again.");
    }
  };

  // Reset new event state
  const resetNewEvent = () => {
    setNewEvent({
      id: 0,
      name: "",
      dateStart: new Date(),
      dateEnd: new Date(new Date().getTime() + 60 * 60 * 1000),
      classId: null,
    });
  };

  return (
    <div className="w-full sm:w-2/5 md:w-3/5 lg:w-4/5 h-[70vh] sm:h-[80vh] lg:h-[90vh] mx-auto mb-5 p-6">
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
        dateClick={handleDateClick}
        ref={calendarRef}
        initialView="dayGridMonth"
        events={events.map((event) => ({
          title: event.name,
          start: event.dateStart.toISOString(), // Convert to string for FullCalendar
          end: event.dateEnd.toISOString(),       // Convert to string for FullCalendar
        }))}
      />
      {showModal && (
        <div className="modal flex flex-col justify-center items-center mb-32">
          <form onSubmit={handleModalSubmit} className="flex flex-col justify-center items-center">
            <input
              type="text"
              placeholder="Lesson Name"
              value={newEvent.name}
              onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
              required
            />
            <input
              type="datetime-local"
              value={newEvent.dateStart.toISOString().slice(0, 16)} // Format for input
              onChange={(e) => setNewEvent({ ...newEvent, dateStart: new Date(e.target.value) })}
              required
            />
            <input
              type="datetime-local"
              value={newEvent.dateEnd.toISOString().slice(0, 16)} // Format for input
              onChange={(e) => setNewEvent({ ...newEvent, dateEnd: new Date(e.target.value) })}
              required
            />
            <button type="submit">Add Lesson</button>
            <button type="button" onClick={() => { setShowModal(false); resetNewEvent(); }}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
}
