"use client";

import { useEffect, useState } from "react";

export default function Timer({ originalTime, timeRemaining, onTimeExpired }) {
  const [remainingTime, setRemainingTime] = useState(timeRemaining);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onTimeExpired();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeExpired]);

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  }

  return (
    <div className="relative">
      <div className="fixed bottom-4 right-4 w-48 select-none rounded bg-white p-4 font-mono shadow-md dark:bg-gray-900">
        <div className="text-lg font-semibold">
          Timer: {formatTime(remainingTime)}
        </div>
        <div className="mt-2 h-4 w-full overflow-hidden rounded bg-gray-300">
          <div
            className="h-4 rounded"
            style={{
              width: `${(remainingTime / originalTime) * 100}%`,
              backgroundColor: `rgb(${Math.min(255, Math.floor((100 - (remainingTime / originalTime) * 100) * 2.55))}, ${Math.min(255, Math.floor((remainingTime / originalTime) * 100 * 2.55))}, 0)`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
