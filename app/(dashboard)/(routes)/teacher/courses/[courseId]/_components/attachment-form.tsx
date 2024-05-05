"use client";

import axios from "axios";
import * as z from "zod";

import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Attachment, Course } from "@prisma/client";
import { File, Loader2, PlusCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AttachmentsProps {
  intialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
});

const Attachments = ({ intialData, courseId }: AttachmentsProps) => {
  const router = useRouter();
  const { toast } = useToast();

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((prev) => !prev);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast({
        title: "Attachment Deleted",
      });
      toggleEdit();
      router.refresh();
    } catch {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        variant: "destructive",
      });
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);

      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);

      toast({
        title: "Course updated",
        variant: "destructive",
      });
      router.refresh();
    } catch {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-3 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Image
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add an file
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {intialData.attachments.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              No attachments yet
            </p>
          )}
          {intialData.attachments.length > 0 && (
            <div className="space-y-2">
              {intialData.attachments.map((attachment) => {
                return (
                  <div
                    key={attachment.id}
                    className="flex items-center p-3 w-full bg-sky-100
                                 border-sky-200 border text-sky-700 rounded-md"
                  >
                    <File className="h-4 w-4 mr-2 flex-shrink-0" />
                    <p className="text-sm line-clamp-1">{attachment.name}</p>
                    {deletingId === attachment.id && (
                      <div>
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    )}
                    {deletingId !== attachment.id && (
                      <Button onClick={()=>onDelete(attachment.id)}
                        variant={"ghost"}
                        className="ml-auto hover:opacity-75 transition"
                      >
                        <X className="h-4 w-4 " />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
          />
          <div className="text-sm  text-muted-foreground mt-1">
            Add anything to your students might need to complete the course.
          </div>
        </div>
      )}
    </div>
  );
};

export default Attachments;
