import { useState, useEffect } from "react";
import PocketBase from "pocketbase";
import Cookies from "js-cookie";
import { Button } from "../ui/button";
import Link from "next/link";
import { Download } from "lucide-react";

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
pb.autoCancellation(false);

export default function DownloadFile({ file }: any) {
  const [records, setRecords] = useState([]);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const pb_cookie = Cookies.get("pb_auth");

      pb.authStore.loadFromCookie(pb_cookie);

      if (!pb.authStore.model?.id) {
        return;
      }

      const userRecord = await pb
        .collection("users")
        .getOne(pb.authStore.model?.id, {
          expand: "branch,courses,roles",
        });

      const res = await pb.collection("content").getFullList({
        sort: "-created",
        filter: `name = "${file}"`,
      });

      if (res.length > 0) {
        const fileUrl = `${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/files/content/${res[0].id}/${res[0].file}`;
        console.log(res[0], fileUrl);
        setUrl(fileUrl);
        setRecords(res);
      }
    };

    fetchData();
  }, [file]);

  if (!url) {
    return <div>Loading...</div>;
  }

  return (
    <div className="my-2 flex flex-col rounded-lg bg-blue-300 dark:bg-slate-900">
      <div className="rounded-t-lg bg-blue-200 px-4 dark:bg-slate-800">
        {records[0].name}
      </div>
      <div className="flex flex-row items-center justify-between">
        <pre className="overflow-auto">
          <code className="font-mono">{records[0].description}</code>
        </pre>
        <Link href={url} download>
          <Download className="m-2" />
        </Link>
      </div>
    </div>
  );
}
