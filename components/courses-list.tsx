import { Category, Course } from "@prisma/client";
import CourseCard from "./course-card";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

interface CourseListProps {
  items: CourseWithProgressWithCategory[];
}

const CoursesList = ({ items }: CourseListProps) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {items.map((item) => {
         return <CourseCard key={item.id} id={item.id} title={item.title} imageUrl={item.imageUrl!}
          chaptersLength={item.chapters.length} progress={item.progress} category={item?.category?.name!} price={item.price!}
         />
        })}
      </div>
      {items.length ===0 && (
        <div className="text-center text-sm  text-muted-foreground">
            No Courses found
        </div>
      )}
    </div>
  );
};

export default CoursesList;
