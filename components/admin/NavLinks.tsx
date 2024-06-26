"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  BookOpen,
  BookText,
  Clipboard,
  Cog,
  Computer,
  Home,
  Pencil,
  User,
} from "lucide-react";

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="grid items-start px-4 text-sm font-medium">
      <Link
        className={`link ${
          pathname === "/admin/dashboard"
            ? "flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
            : "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
        }`}
        href="/admin/dashboard"
      >
        <Home className="h-4 w-4" />
        Dashboard
      </Link>
      <Link
        className={`link ${
          pathname === "/admin/students"
            ? "flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
            : "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
        }`}
        href="/admin/students"
      >
        <User className="h-4 w-4" />
        Students
      </Link>
      <Link
        className={`link ${
          pathname === "/admin/content"
            ? "flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
            : "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
        }`}
        href="/admin/content"
      >
        <BookOpen className="h-4 w-4" />
        Content
      </Link>
      <Link
        className={`link ${
          pathname === "/admin/exercises"
            ? "flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
            : "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
        }`}
        href="/admin/exercises"
      >
        <Computer className="h-4 w-4" />
        Exercises
      </Link>
      <Link
        className={`link ${
          pathname === "/admin/quizzes"
            ? "flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
            : "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
        }`}
        href="/admin/quizzes"
      >
        <Clipboard className="h-4 w-4" />
        Quizzes
      </Link>
      <Link
        className={`link ${
          pathname === "/admin/exams"
            ? "flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
            : "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
        }`}
        href="/admin/exams"
      >
        <BookText className="h-4 w-4" />
        Exams
      </Link>
      <Link
        className={`link ${
          pathname === "/admin/grades"
            ? "flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
            : "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
        }`}
        href="/admin/grades"
      >
        <Pencil className="h-4 w-4" />
        Grades
      </Link>
      {/* <Link
        className={`link ${
          pathname === "/admin/settings"
            ? "flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
            : "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
        }`}
        href="/admin/settings"
      >
        <Cog className="h-4 w-4" />
        Settings
      </Link> */}
    </nav>
  );
}
