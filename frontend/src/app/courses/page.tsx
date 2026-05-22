"use client";

import dynamic from "next/dynamic";

const CoursesPageContent = dynamic(() => import("@/components/CoursesPageContent"), {
  ssr: false,
});

export default function CoursesPage() {
  return <CoursesPageContent />;
}