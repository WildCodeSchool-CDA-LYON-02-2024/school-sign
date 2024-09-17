import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { calendarSchema } from "@/lib/schemas/calendarSchema";

interface EventDialogProps {
  open: boolean;
  onClose: () => void;
  event: { title: string; start: string; allDay: boolean; id: number };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function EventDialog({
  open,
  onClose,
  event,
  onChange,
}: EventDialogProps) {
  const form = useForm<z.infer<typeof calendarSchema>>({
    resolver: zodResolver(calendarSchema),
    defaultValues: {
      title: "Lesson",
      // date: Date.now().toString(),
    },
  });

  const onSubmit = (values: z.infer<typeof calendarSchema>) => {
    console.log(values);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Event</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="title">Title</FormLabel>
                  <FormControl>
                    <Input
                      id="title"
                      type="text"
                      placeholder="Title"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public title name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.watch("title") === ""}>
                Create
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
