"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { BookOpen, Clipboard, Cog, Home, Pencil, User } from "lucide-react";

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="grid items-start px-4 text-sm font-medium">
      <Link
        className={`link ${
          pathname === "/course/c3"
            ? "flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
            : "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
        }`}
        href="/course/c3"
      >
        <Home className="h-4 w-4" />
        Home
      </Link>
      <Link
        className={`link ${
          pathname === "/course/students"
            ? "flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
            : "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
        }`}
        href="/course/students"
      >
        <User className="h-4 w-4" />
        Block 01
      </Link>
      <Link
        className={`link ${
          pathname === "/course/courses"
            ? "flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
            : "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
        }`}
        href="/course/courses"
      >
        <BookOpen className="h-4 w-4" />
        Block 02
      </Link>
      <Link
        className={`link ${
          pathname === "/course/assignments"
            ? "flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
            : "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
        }`}
        href="/course/assignments"
      >
        <Clipboard className="h-4 w-4" />
        Block 03
      </Link>
      <Link
        className={`link ${
          pathname === "/course/grades"
            ? "flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
            : "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
        }`}
        href="/course/grades"
      >
        <Pencil className="h-4 w-4" />
        Block 04
      </Link>
      <Link
        className={`link ${
          pathname === "/admin/settings"
            ? "flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
            : "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
        }`}
        href="/admin/settings"
      >
        <Cog className="h-4 w-4" />
        Settings
      </Link>
    </nav>
  );
}
