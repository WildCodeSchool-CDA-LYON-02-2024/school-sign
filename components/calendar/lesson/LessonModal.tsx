import {
  Dialog,
  DialogContent,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "@radix-ui/react-icons";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { lessonSchema } from "@/lib/schemas/lessonSchema";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

export type LessonFormValues = z.infer<typeof lessonSchema>;

interface LessonModalProps {
  open: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultValues: Partial<LessonFormValues> = {
  name: "New Lesson",
  dateStart: "",
  dateEnd: "",
};

export function LessonModal({ open, setShowModal }: LessonModalProps) {
  const { handleModalSubmit } = useCalendarEvents();

  const formatDateTimeLocal = (dateTime: string) => {
    if (!dateTime) return "";
    return new Date(dateTime)
      .toLocaleString("sv-SE", {
        timeZone: "Europe/Paris",
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
      .slice(0, 16);
  };

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues,
  });

  return (
    <Dialog open={open} onOpenChange={setShowModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add A Lesson</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleModalSubmit)}
            className="space-y-8 rounded"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Lesson Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Lesson Name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Insert the name of the lesson.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateStart"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Starting Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            formatDateTimeLocal(field.value)
                          ) : (
                            <span>Pick a starting date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value
                            ? new Date(formatDateTimeLocal(field.value))
                            : undefined
                        }
                        onSelect={field.onChange}
                        // onSelect={(date) =>
                        //   field.onChange(date ? date.toISOString() : "")
                        // }
                        // disabled={(date) =>
                        //   date > new Date() || date < new Date("1900-01-01")
                        // }
                        // classNames={classNames}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Insert the starting date of the lesson.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateEnd"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Ending Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            formatDateTimeLocal(field.value)
                          ) : (
                            <span>Pick an ending date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) =>
                          field.onChange(date ? date.toISOString() : "")
                        }
                        // disabled={(date) =>
                        //   date > new Date() || date < new Date("1900-01-01")
                        // }
                        // classNames={classNames}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Insert the ending date of the lesson.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex-row-reverse justify-between">
              <Button type="submit" disabled={!form.formState.isValid}>
                Add Lesson
              </Button>
              <Button type="button" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
