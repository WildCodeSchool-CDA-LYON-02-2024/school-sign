import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EventDialogProps {
  open: boolean;
  onClose: () => void;
  event: { title: string; start: string; allDay: boolean; id: number };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function EventDialog({
  open,
  onClose,
  event,
  onChange,
  onSubmit,
}: EventDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="title"
            value={event.title}
            onChange={onChange}
            placeholder="Title"
            className="block w-full rounded-md border p-2"
          />
          <DialogFooter>
            <Button type="submit" disabled={event.title === ""}>
              Create
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
