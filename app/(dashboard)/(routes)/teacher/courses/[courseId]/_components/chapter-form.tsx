"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Chapter, Course } from "@prisma/client";
import { Loader2, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChaptersList } from "./chapter-list";

interface ChapterFormProps {
  intialData: Course & {chapters:Chapter[]};
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1, { message: "title is required" }),
});

const ChapterForm = ({ intialData, courseId }: ChapterFormProps) => {
  const router = useRouter();
  const { toast } = useToast();

  const [isCreating,setIsCreating]=useState(false);
  const [isUpdating,setIsUpdating]=useState(false);

  const toggleCreating = () => setIsCreating((prev) => !prev);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values);
      toast({
        title: "Chapter created",
      });
      toggleCreating();
      router.refresh();
    } catch {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        variant: "destructive",
      });
    }
  };

  const onReorder =async (updatedData:{id:string,position:number}[])=>{
    try {
          setIsUpdating(true);
          await axios.put(`/api/courses/${courseId}/chapters/reorder`,{list:updatedData});
          toast({
            title: "Chapters reordered",
          });
          router.refresh();
    } catch (e) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        variant: "destructive",
      });
    }finally{
      setIsUpdating(false);
    }
  }

  const onEdit = (id:string)=>{
    router.push(`/teacher/courses/${courseId}/chapters/${id}`);
  }

  return (
    <div className="mt-3 relative border bg-slate-100 rounded-md p-4">
      {
        isUpdating && <div className=" absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md 
        flex items-center justify-center
        ">
          <Loader2 className=" animate-spin h-6 w-6 text-sky-700" />
          </div>
      }
      <div className="font-medium flex items-center justify-between">
        Course Description
        <Button variant="ghost" onClick={toggleCreating}>
          {isCreating ? (
            <>Cancel</>
          ) : (
            <div className="flex items-center">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a chapter
            </div>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-3"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder="e.g. 'Introduction to the course'"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              <Button disabled={!isValid || isSubmitting} type="submit">
                Create
              </Button>
          </form>
        </Form>
      )}
      {
        !isCreating && (
          <div className={cn("text-sm mt-2",!intialData?.chapters.length && "text-slate-500 italic")}>
           {!intialData.chapters.length && 'No chapters'}
          <ChaptersList onEdit={onEdit} onReorder={onReorder} items={intialData.chapters || []} />
          </div>
        )
      }
      {
        !isCreating && (
          <p className="text-xs text-muted-foreground">
              Drag and drop to reorder the chapters
          </p>
        )
      }
    </div>
  );
};

export default ChapterForm;
