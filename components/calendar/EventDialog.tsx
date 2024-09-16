import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { Form, useForm } from "react-hook-form";

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
  const form = useForm();
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Event</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form>
          <FormField
              control={form.control}
              name="title"
              render={({field}) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>This is your public title name.</FormDescription>
                <FormMessage />
              </FormItem>
          )}  />
        </Form>
        // <form onSubmit={onSubmit}>
        //   <div className="grid w-full max-w-sm items-center gap-1.5">
        //     <Label htmlFor="title">Title</Label>
        //     <Input
        //       type="text"
        //       name="title"
        //       value={event.title}
        //       onChange={onChange}
        //       placeholder="Title"
        //     />
        //   </div>
        //   <DialogFooter>
        //     <Button type="submit" disabled={event.title === ""}>
        //       Create
        //     </Button>
        //     <Button variant="ghost" onClick={onClose}>
        //       Cancel
        //     </Button>
        //   </DialogFooter>
        // </form>
      </DialogContent>
    </Dialog>
  );
}
