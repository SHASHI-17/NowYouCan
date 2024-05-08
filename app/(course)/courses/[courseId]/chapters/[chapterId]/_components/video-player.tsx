"use client";
import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { useState } from "react";
import { boolean, string } from "zod";
import { Loader2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  playbackId: string;
  courseId: string;
  title: string;
  chapterId: string;
  nextChapterId: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  videoUrl:string
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

    const [isReady,setIsReady]=useState(false);
    const [onAbort,setOnAbort]=useState(false);
    
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
            <p className="text-sm">
                This Chapter is locked
            </p>
        </div>
      )}
       {!isLocked && !onAbort && playbackId ?(
        <MuxPlayer
            className={cn("w-full h-full",!isReady && "hidden")} autoPlay onCanPlay={()=>setIsReady(true)}
          playbackId={playbackId} onError={()=>setOnAbort(true)}
        />
      ):(
        <video src={videoUrl} onCanPlay={()=>setIsReady(true)} title={title} 
        autoPlay className={cn(" w-full h-full bg-black",!isReady && "hidden")} controls />
      )}
    </div>
  );
};
