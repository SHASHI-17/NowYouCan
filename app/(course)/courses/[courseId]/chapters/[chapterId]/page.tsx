import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preveiw";
import { File } from "lucide-react";

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();
  if (!userId) return redirect("/");

  const {
    chapter,
    course,
    muxData,
    userProgress,
    attachments,
    purchase,
    nextChapter,
  } = await getChapter({
    userId,
    chapterId: params.chapterId,
    courseId: params.courseId,
  });

  if (!chapter || !course) return redirect("/");

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = Boolean(purchase) && !userProgress?.isCompleted;
  const videoUrl = chapter.videoUrl;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner
          label="You already completed this chapter."
          variant={"success"}
        />
      )}
      {isLocked && (
        <Banner
          label="You need to purchase this course to watch this chapter."
          variant={"warning"}
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={params.chapterId}
            title={chapter.title}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
            playbackId={muxData?.playbackId!}
            videoUrl={videoUrl!}
          />
        </div>
        <div>
          <div className="p-4 flex flex-col  md:flex-row  items-center justify-between">
            <h2 className="text-2xl">{chapter.title}</h2>
            {!purchase ? (
              <div>{/* {progress } */}</div>
            ) : (
              <CourseEnrollButton
                courseId={params.courseId}
                price={course.price!}
              />
            )}
          </div>
          <Separator />
          <div>
            <Preview value={chapter.description!} />
          </div>
          <div>
            {Boolean(attachments.length) && (
              <>
                <Separator />
                <div className="p-4">
                  {attachments.map((attachment) => {
                    return (
                      <a
                        className=" flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md
                        hover:underline"
                        title={attachment.name}
                        href={attachment.url}
                        target="_blank"
                        key={attachment.id}
                      >
                        <File/>
                        <p className=" line-clamp-1">{attachment.name}</p>
                      </a>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;