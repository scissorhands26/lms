import { useState, useEffect } from "react";
import PocketBase from "pocketbase";
import Cookies from "js-cookie";

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
pb.autoCancellation(false);

export default function DownloadFile({ file }) {
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

      const records = await pb.collection("content").getFullList({
        sort: "-created",
        filter: `name = "${file}"`,
      });

      if (records.length > 0) {
        const fileUrl = `${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/files/content/${records[0].id}/${records[0].file}`;
        console.log(records[0], fileUrl);
        setUrl(fileUrl);
      }
    };

    fetchData();
  }, [file]);

  if (!url) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <a href={url} download>
        <button className="btn">Download</button>
      </a>
    </div>
  );
}
