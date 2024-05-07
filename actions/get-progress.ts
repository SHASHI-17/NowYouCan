import { db } from "@/lib/db";

export const getProgress = async (courseId: string, userId: string): Promise<number> => {
    try {
        const publishedCourse = await db.chapter.findMany({
            where: {
                courseId,
                isPublished: true,
            },
            select: {
                id: true
            }
        });
        const publishChapterIds = publishedCourse.map(chapter => chapter.id);

        const validCompletedChapters = await db.userProgress.count({
            where: {
                userId,
                chapterId: {
                    in: publishChapterIds
                },  
                isCompleted: true
            }
        });

        const progressCompleted = (validCompletedChapters / publishChapterIds.length) * 100;

        return progressCompleted;


    } catch (e) {
        console.log("[GET_PROGRESS]", e);
        return 0;
    }
}