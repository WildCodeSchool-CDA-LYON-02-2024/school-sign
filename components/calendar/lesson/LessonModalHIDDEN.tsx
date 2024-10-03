// import { Lesson } from "@/components/calendar/Calendar";
//
// interface LessonModalProps {
//   newEvent: Lesson;
//   setNewEvent: React.Dispatch<React.SetStateAction<Lesson>>;
//   handleModalSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
//   setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
// }
//
// export function LessonModal({
//   newEvent,
//   setNewEvent,
//   handleModalSubmit,
//   setShowModal,
// }: LessonModalProps) {
//   const formatDateTimeLocal = (dateString: string) => {
//     if (!dateString) return "";
//     return new Date(dateString)
//       .toLocaleString("sv-SE", {
//         timeZone: "Europe/Paris",
//         hour12: false,
//         year: "numeric",
//         month: "2-digit",
//         day: "2-digit",
//         hour: "2-digit",
//         minute: "2-digit",
//       })
//       .slice(0, 16);
//   };
//
//   return (
//     <div className="modal flex flex-col justify-center items-center mb-32">
//       <form
//         onSubmit={handleModalSubmit}
//         className="flex flex-col justify-center items-center"
//       >
//         <input
//           type="text"
//           placeholder="Lesson Name"
//           value={newEvent.name}
//           onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
//           required
//         />
//         <input
//           type="datetime-local"
//           value={formatDateTimeLocal(newEvent.dateStart)}
//           onChange={(e) =>
//             setNewEvent({
//               ...newEvent,
//               dateStart: new Date(e.target.value).toISOString(),
//             })
//           }
//           required
//         />
//         <input
//           type="datetime-local"
//           value={formatDateTimeLocal(newEvent.dateEnd)}
//           onChange={(e) =>
//             setNewEvent({
//               ...newEvent,
//               dateEnd: new Date(e.target.value).toISOString(),
//             })
//           }
//           required
//         />
//         <button type="submit">Add Lesson</button>
//         <button type="button" onClick={() => setShowModal(false)}>
//           Cancel
//         </button>
//       </form>
//     </div>
//   );
// }
