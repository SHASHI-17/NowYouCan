"use client"

import { Category } from "@prisma/client";
import {FcEngineering,FcMultipleDevices,FcMusic,FcOldTimeCamera,FcSalesPerformance,
    FcFilmReel,FcSportsMode
}from "react-icons/fc"
import CategoryItem from "./category-item";

type CategoryProps={
    items:Category[]
}
const iconMap:any = {
    Music: FcMusic,
    Photography: FcOldTimeCamera,
    Fitness: FcSportsMode,
    Accounting: FcSalesPerformance,
    "Computer Science": FcMultipleDevices,
    Filming: FcFilmReel,
    Engineering: FcEngineering,
  };
const Categories = ({items}:CategoryProps) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id}
        />
      ))}
    </div>
  )
}

export default Categories