import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-row gap-4">
        <Link href="/c3">
          <Card>
            <CardHeader>
              <CardTitle>Course</CardTitle>
              <CardDescription>Course Content</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Click Here</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/dashboard">
          <Card>
            <CardHeader>
              <CardTitle>Admin</CardTitle>
              <CardDescription>Administrator panel</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Click Here</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </main>
  );
}
