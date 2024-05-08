"use client";
import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { useState } from "react";
import { boolean, string } from "zod";
import { Loader2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { useToast } from "@/components/ui/use-toast";

interface VideoPlayerProps {
  playbackId: string;
  courseId: string;
  title: string;
  chapterId: string;
  nextChapterId: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  videoUrl: string;
}

export const VideoPlayer = ({
  videoUrl,
  playbackId,
  courseId,
  title,
  chapterId,
  nextChapterId,
  isLocked,
  completeOnEnd,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const [onAbort, setOnAbort] = useState(false);

  const router = useRouter();
  const { onOpen } = useConfettiStore();
  const { toast } = useToast();

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(
          `/api/courses/${courseId}/chapters/${chapterId}/progress`,
          {
            isCompleted: true,
          }
        );
      }

      if (!nextChapterId) {
        onOpen();
        toast({
          title: "Course Completed",
        });
      }

      toast({
        title: "Progress updated",
      });
      router.refresh();
      if (nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }
    } catch (error) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className=" absolute inset-0 flex items-center  justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      )}
      {isLocked && (
        <div
          className=" absolute inset-0 flex items-center justify-center bg-slate-800 flex-col
                    gap-y-2 text-secondary"
        >
          <Lock className="h-8 w-8" />
          <p className="text-sm">This Chapter is locked</p>
        </div>
      )}
      {!isLocked && !onAbort && playbackId ? (
        <MuxPlayer
          className={cn("w-full h-full", !isReady && "hidden")}
          autoPlay
          onCanPlay={() => setIsReady(true)}
          playbackId={playbackId}
          onError={() => setOnAbort(true)}
          onEnded={onEnd}
        />
      ) : (
        <video
          src={videoUrl}
          onCanPlay={() => setIsReady(true)}
          title={title}
          autoPlay
          className={cn(" w-full h-full bg-black", !isReady && "hidden")}
          controls onEnded={onEnd}
        />
      )}
    </div>
  );
};
