"use client";

import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import MuxPlayer from '@mux/mux-player-react';
import { Chapter, MuxData } from "@prisma/client";
import axios from "axios";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as z from "zod";

interface ChapterVideoProps {
  intialData: Chapter & {muxdata?:MuxData | null };
  courseId: string;
  chapterId:string;
  playback:string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

const ChapterVideo = ({ intialData, courseId ,chapterId,playback}: ChapterVideoProps) => {
  const router = useRouter();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((prev) => !prev);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      toast({
        title: "Chapter updated",
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


  return (
    <div className="mt-3 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Video
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing && <>Cancel</>}
          {!isEditing && !intialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a video
            </>
          )}
          {!isEditing && intialData.videoUrl && (
            <div className="flex items-center">
              <Pencil className="h-4 w-4 mr-2" />
              Edit video
            </div>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!intialData.videoUrl ? (
          <div className="flex items-center justify-center h-20 bg-slate-200 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className=" relative aspect-video mt-1">
              <MuxPlayer playbackId={playback} className="w-full h-full" />
              {/* <video controls className="w-full h-[300px]" autoPlay={true}  src={intialData.videoUrl}></video> */}
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <div className="text-sm  text-muted-foreground mt-1">
            upload this chapter&apos;s video and wait until the video gets started
          </div>
        </div>
      )}
      {
        intialData.videoUrl && !isEditing && (
          <div className="text-sm text-muted-foreground mt-2">
            Videos can take a few minutes to process. Refresh the page if video doen not appear or even the video is not ready.
          </div>
        )
      }
    </div>
  );
};

export default ChapterVideo;
