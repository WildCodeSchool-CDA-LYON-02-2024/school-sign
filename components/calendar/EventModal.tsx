import React from "react";

const EventModal = ({
  show,
  onClose,
  onSubmit,
  newEvent,
  setNewEvent,
}: {
  show: boolean;
  onClose: () => void;
  onSubmit: () => void;
  newEvent: { title: string; dateStart: string; dateEnd: string };
  setNewEvent: React.Dispatch<React.SetStateAction<{ title: string; dateStart: string; dateEnd: string }>>;
}) => {
  if (!show) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Ajouter un Événement</h2>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
          <label>
            Nom:
            <input
              type="text"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              required
            />
          </label>
          <label>
            Date de Début:
            <input
              type="datetime-local"
              value={newEvent.dateStart}
              onChange={(e) => setNewEvent({ ...newEvent, dateStart: e.target.value })}
              required
            />
          </label>
          <label>
            Date de Fin:
            <input
              type="datetime-local"
              value={newEvent.dateEnd}
              onChange={(e) => setNewEvent({ ...newEvent, dateEnd: e.target.value })}
              required
            />
          </label>
          <button type="submit">Ajouter</button>
          <button type="button" onClick={onClose}>Annuler</button>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
