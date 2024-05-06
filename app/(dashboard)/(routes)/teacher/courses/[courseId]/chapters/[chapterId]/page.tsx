import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import ChapterTitleForm from "./_components/chapter-title-form";
import ChapterDescForm from "./_components/chapter-desc-form";
import ChapterAccessForm from "./_components/chapter-access-form";
import ChapterVideo from "./_components/chapter-video-form";

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();

  if (!userId) return redirect("/");

  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId,
    },
    include: {
      muxData: true,
    },
  });

  if (!chapter) return redirect("/");

  const requiredFields = [chapter.description, chapter.title, chapter.videoUrl];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <Link
            href={`/teacher/courses/${params.courseId}`}
            className="flex items-center text-sm hover:opacity-75 transition mb-6"
          >
            <ArrowLeft className="h-4 m-4 mr-2" />
            Back to course setup
          </Link>
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Chapter Creation</h1>
              <span>Complete all fields {completionText}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 md:grid-col-2 gap-6 mt-16">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2>
                Customize your chapter
              </h2>
            </div>
            <ChapterTitleForm intialData={chapter} courseId={params.courseId} chapterId={params.chapterId} />
            <ChapterDescForm intialData={chapter} courseId={params.courseId} chapterId={params.chapterId} />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
                    <IconBadge icon={Eye} />
                    <h2 className="text-xl">
                        Access Settings
                    </h2>
            </div>
            <ChapterAccessForm intialData={chapter} courseId={params.courseId} chapterId={params.chapterId} />
          </div>
        </div>
        <div>
            <div className="flex items-center gap-x-2">
                <IconBadge icon={Video} />
                <h2 className="text-2xl">Add a video </h2>
            </div>
            <ChapterVideo intialData={chapter} courseId={params.courseId} chapterId={params.chapterId} />
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
