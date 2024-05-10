"use client";
import { loadStripe } from '@stripe/stripe-js';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { formatPrice } from "@/lib/format";
import axios from "axios";
import { useState } from "react";

interface CourseEnrollButtonProps {
  price: number;
  courseId: string;
}

loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  );

export const CourseEnrollButton = ({price,courseId}: CourseEnrollButtonProps) => {

    const [numberToCopy] = useState('4000003560000008');
    const [isCopied,setIsCopied]=useState(false);
    const [isLoading,setIsLoading]=useState(false);
    const {toast}=useToast();
    
    const onCLick=async ()=>{
        try {
            setIsLoading(true);
            const response =await axios.post(`/api/courses/${courseId}/checkout`);
            window.location.assign(response.data.url);
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

  return <div className="flex flex-col gap-2 items-center justify-center relative ">
        <Button className="ml-auto w-full md:w-auto" size={'sm'} onClick={onCLick} disabled={isLoading}>
    Enroll for {formatPrice(price)}
    </Button>
    <Button variant={'ghost'} className="text-sm cursor-pointer text-sky-500 bg-sky-500/10 hover:text-sky-400" 
    onClick={()=>{
        navigator.clipboard.writeText(numberToCopy);
        setIsCopied(true);
        // setTimeout(()=>{
        //     setIsCopied(false);
        // },1500)
        toast({
            title:'Copied'
        })
    }}
    > Copy this free card to purchase </Button>
    {/* {isCopied && (<div className="absolute left-[20px] -top-[1px] transition text-sm bg-black/40 text-white p-2 text rounded-full">
        copied
    </div>)} */}
  </div>
};
