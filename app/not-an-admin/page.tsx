"use client";

import { useEffect, useState } from "react";
import { GetUser } from "@/components/markdown/GetUser";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";

export default function NotAnAdmin() {
  const [step, setStep] = useState(0);
  const [user, setUser] = useState();
  const [shameWall, setShameWall] = useState([]);
  const [keypresses, setKeypresses] = useState(["▢"]);

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handleCancel = () => {
    setStep(0);
  };

  useEffect(() => {
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39];
    let konamiCodePosition = 0;
    let konamiTimeout;

    const handleKeyDown = async (event) => {
      clearTimeout(konamiTimeout);
      setKeypresses((prev) => [...prev, event.key].slice(-1));

      if (event.keyCode === konamiCode[konamiCodePosition]) {
        konamiCodePosition++;
        if (konamiCodePosition === konamiCode.length) {
          const res = await hideShame();
          console.log("Konami code entered!");
          konamiCodePosition = 0; // Reset position after successful sequence
        }
      } else {
        konamiCodePosition = 0;
      }
      konamiTimeout = setTimeout(() => {
        konamiCodePosition = 0;
      }, 1000); // Reset sequence if no key is pressed within 1 second
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(konamiTimeout);
    };
  }, []);

  useEffect(() => {
    async function checkUser() {
      const user = await GetUser();
      setUser(user);
    }
    checkUser();
  }, []);

  async function hideShame() {
    const user = await GetUser();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/collections/admin_logs/records?filter=(user='${user.id}')`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const response = await res.json();

    const promises = response.items.map((log) =>
      fetch(
        `${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/collections/admin_logs/records/${log.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({ hidden: true }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    );

    await Promise.all(promises);
    const updatedShame = await getShame();
    setShameWall(updatedShame.items.filter((item) => !item.hidden));

    return response;
  }

  async function logShame(data) {
    await fetch(
      `${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/collections/admin_logs/records`,
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  async function getShame() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/collections/admin_logs/records?sort=-created&expand=user`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const response = await res.json();
    setShameWall(response.items.filter((item) => !item.hidden));
    return response;
  }

  useEffect(() => {
    async function logAndFetchShame() {
      const user = await GetUser();

      if (step === 5) {
        const data = {
          user: user?.id,
          time: new Date().toISOString(),
        };

        await logShame(data);
        getShame();
      }
    }

    logAndFetchShame();
  }, [step]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="rounded bg-slate-900 p-8 text-center shadow-lg">
        <h1 className="mb-4 text-5xl font-bold text-red-500">Not an admin</h1>

        {step === 5 ? (
          <div className="mt-4">
            Yeah, nice try kid. Get back to studying. 💀
            <span className="font-bold italic text-red-500">
              {" "}
              We logged this by the way.{" "}
            </span>
            💀
            <div>
              <div className="my-2 italic text-slate-500">
                Konami might be able to get you off the list...
              </div>
              {shameWall && shameWall.length > 0 && (
                <div>
                  <h2 className="mt-4 text-2xl font-bold text-red-500">
                    Shame Wall
                  </h2>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-left">Student</TableHead>
                        <TableHead className="text-right">Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shameWall.map(
                        (shame: any) =>
                          shame.hidden === false && (
                            <TableRow key={shame.id}>
                              <TableCell className="text-left">
                                {shame.expand.user.rank}{" "}
                                {shame.expand.user.last_name}
                                {", "}
                                {shame.expand.user.first_name}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatTime(shame.time)}
                              </TableCell>
                            </TableRow>
                          ),
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {step === 0 && (
              <p
                className="cursor-pointer text-gray-700"
                onClick={handleNextStep}
              >
                Show me anyway
              </p>
            )}
            {step === 1 && (
              <div className="mt-4 text-gray-300">
                <p className="text-lg">Are you sure you want to see?</p>
                <div className="mt-2 space-x-4">
                  <button
                    className="rounded bg-green-600 px-4 py-2 text-white"
                    onClick={handleNextStep}
                  >
                    Yes
                  </button>
                  <button
                    className="rounded bg-gray-500 px-4 py-2 text-white"
                    onClick={handleCancel}
                  >
                    No
                  </button>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="mt-4 text-gray-300">
                <p className="text-xl">
                  Are you really sure? You're not supposed to be looking at the
                  admin dashboard.
                </p>
                <div className="mt-2 space-x-4">
                  <button
                    className="rounded bg-green-600 px-4 py-2 text-white"
                    onClick={handleNextStep}
                  >
                    Yes
                  </button>
                  <button
                    className="rounded bg-gray-500 px-4 py-2 text-white"
                    onClick={handleCancel}
                  >
                    No
                  </button>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="mt-4 text-gray-300">
                <p className="text-2xl">
                  You could be violating your academic agreement by viewing
                  this. Do you want to continue?
                </p>
                <div className="mt-2 space-x-4">
                  <button
                    className="rounded bg-green-600 px-4 py-2 text-white"
                    onClick={handleNextStep}
                  >
                    Yes
                  </button>
                  <button
                    className="rounded bg-gray-500 px-4 py-2 text-white"
                    onClick={handleCancel}
                  >
                    No
                  </button>
                </div>
              </div>
            )}
            {step === 4 && (
              <div className="mt-4 text-gray-300">
                <p className="text-3xl">
                  Viewing the admin dashboard without permission is an{" "}
                  <span className="font-bold italic text-red-500">
                    academic integrity violation.
                  </span>{" "}
                  View anyway?
                </p>
                <div className="mt-2 space-x-4">
                  <button
                    className="rounded bg-green-600 px-4 py-2 text-white"
                    onClick={handleNextStep}
                  >
                    Yes
                  </button>
                  <button
                    className="rounded bg-gray-500 px-4 py-2 text-white"
                    onClick={handleCancel}
                  >
                    No
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <div className="fixed bottom-4 right-4 rounded bg-slate-800 p-2 text-white shadow-lg">
        <p>
          Key pressed:{" "}
          {keypresses
            .map((key) => {
              switch (key) {
                case "ArrowUp":
                  return "⬆️";
                case "ArrowDown":
                  return "⬇️";
                case "ArrowLeft":
                  return "⬅️";
                case "ArrowRight":
                  return "➡️";
                default:
                  return "▢";
              }
            })
            .join(", ")}
        </p>
      </div>
    </div>
  );
}

function formatTime(date: string) {
  const now = new Date();
  const then = new Date(date);
  const diff = now.getTime() - then.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} days ago`;
  }

  if (hours > 0) {
    return `${hours} hours ago`;
  }

  if (minutes > 0) {
    return `${minutes} minutes ago`;
  }

  return `${seconds} seconds ago`;
}
