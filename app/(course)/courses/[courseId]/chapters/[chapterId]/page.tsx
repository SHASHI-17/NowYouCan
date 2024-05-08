import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();
  if (!userId) return redirect("/");

  const { chapter, course, muxData, userProgress, attachments, purchase ,nextChapter} =
    await getChapter({
      userId,
      chapterId: params.chapterId,
      courseId: params.courseId,
    });

    if(!chapter || !course) return redirect('/');

    const isLocked = !chapter.isFree && !purchase;
    const completeOnEnd = Boolean(purchase) && !userProgress?.isCompleted

  return <div>
        {
            userProgress?.isCompleted && (
                <Banner label="You already completed this chapter." variant={'success'} />
            )
        }
        {
            isLocked && (
                <Banner label="You need to purchase this course to watch this chapter." variant={'warning'} />
            )
        }
        <div className="flex flex-col max-w-4xl mx-auto pb-20">
                <div className="p-4">
                        <VideoPlayer chapterId={params.chapterId} title={chapter.title} courseId={params.courseId}
                        nextChapterId={nextChapter?.id} muxData={muxData?.playbackId} isLocked={isLocked} 
                        completeOnEnd={completeOnEnd} />
                </div>
        </div>
  </div>
};

export default ChapterIdPage;
