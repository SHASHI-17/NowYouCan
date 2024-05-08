"use client"

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CourseProgressButtonProps{
    chapterId:string,
    courseId:string,
    isCompleted?:boolean,
    nextChapterId?:string;
}

const CourseProgressButton = ({chapterId,courseId,isCompleted,nextChapterId}:CourseProgressButtonProps) => {

    const Icon=isCompleted ? XCircle : CheckCircle;

    const router = useRouter();
    const confetti=useConfettiStore();
    const {toast}=useToast();
    const [isLoading,setIsLoading]=useState(false);
    
    const onCLick=async()=>{
        try {
            setIsLoading(true);
            await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`,{
                isCompleted: !isCompleted
            });

            if(!isCompleted && !nextChapterId){
                confetti.onOpen();
                toast({
                    title: "Course Completed",
                  });
            }

            if(!isCompleted && nextChapterId){
                router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
            }

            toast({
                title:'Progress updated'
            })
            router.refresh();
        } catch (error) {
            toast({
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
                variant: "destructive",
              });
        }finally{
            setIsLoading(false);
        }
    }

  return (
    <Button type='button' variant={isCompleted ? 'outline':'success'} className="w-full md:w-auto" onClick={onCLick}>
        {isCompleted ? 'Not completed':'Mark as complete'}
        <Icon className="h-4 w-4 ml-2" />
    </Button>
  )
}

export default CourseProgressButton