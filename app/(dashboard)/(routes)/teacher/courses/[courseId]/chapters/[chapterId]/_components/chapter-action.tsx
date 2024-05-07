"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { boolean } from "zod";

interface ChapterActionsProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
}

export const ChapterActions = ({
  disabled,
  chapterId,
  courseId,
  isPublished,
}: ChapterActionsProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
      toast({
        title: "Chapter deleted",
        variant:'destructive'
      });
      router.refresh();
      router.push(`/teacher/courses/${courseId}`);
    } catch {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onClick = async ()=>{
    try {
      setIsLoading(true);
      if(isPublished){
        await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`);
        toast({
          title: "Chapter unpublished"
        });
      }else{
        await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`);
        toast({
          title: "Chapter published"
        });
      }
      router.refresh();
    } catch  {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        variant: "destructive",
      });
    }finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant={"outline"}
        size={"sm"}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete} >
        <Button size={"sm"} disabled={isLoading} >
          <Trash className="w-4 h-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
