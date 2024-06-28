"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FollowerPointerCard } from "@/components/ui/following-pointer";

export default function Timer({
  originalTime,
  timeRemaining,
  onTimeExpired,
}: any) {
  const [remainingTime, setRemainingTime] = useState(timeRemaining);
  const [showDecrement, setShowDecrement] = useState(false);
  const [flashDamage, setFlashDamage] = useState(false);
  const [damageAmount, setDamageAmount] = useState("");
  const [ammo, setAmmo] = useState(6);

  const emojis = [
    "😊", // 100-90% remaining
    "😀", // 90-80% remaining
    "🙂", // 80-70% remaining
    "😌", // 70-60% remaining
    "😐", // 60-50% remaining
    "😑", // 50-40% remaining
    "😟", // 40-30% remaining
    "😕", // 30-20% remaining
    "😰", // 20-18% remaining
    "😱", // 18-16% remaining
    "😨", // 16-14% remaining
    "😧", // 14-12% remaining
    "😦", // 12-10% remaining
    "😢", // 10-8% remaining
    "😭", // 8-6% remaining
    "😖", // 6-4% remaining
    "😵", // 4-2% remaining
    "💀", // Less than 2% remaining
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevTime: any) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onTimeExpired();
          return 0;
        }
        setShowDecrement(true);
        setDamageAmount("-1 sec");
        setTimeout(() => setShowDecrement(false), 750); // Hide after 500ms
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeExpired]);

  function handleClick() {
    if (ammo > 0) {
      setAmmo((prevAmmo) => prevAmmo - 1);
      setRemainingTime((prevTime: any) => {
        const newTime = prevTime - 10 > 0 ? prevTime - 10 : 0;
        if (newTime <= 1) {
          onTimeExpired();
          return 0;
        }
        setFlashDamage(true);
        setDamageAmount("-10 sec");
        setShowDecrement(true);
        setTimeout(() => {
          setShowDecrement(false);
          setFlashDamage(false);
        }, 100); // Hide after 500ms
        return newTime;
      });
    }
  }

  function formatTime(seconds: any) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  }

  function getEmoji() {
    const percentageRemaining = (remainingTime / originalTime) * 100;

    if (percentageRemaining > 90) {
      return emojis[0];
    } else if (percentageRemaining > 80) {
      return emojis[1];
    } else if (percentageRemaining > 70) {
      return emojis[2];
    } else if (percentageRemaining > 60) {
      return emojis[3];
    } else if (percentageRemaining > 50) {
      return emojis[4];
    } else if (percentageRemaining > 40) {
      return emojis[5];
    } else if (percentageRemaining > 30) {
      return emojis[6];
    } else if (percentageRemaining > 20) {
      return emojis[7];
    } else if (percentageRemaining > 18) {
      return emojis[8];
    } else if (percentageRemaining > 16) {
      return emojis[9];
    } else if (percentageRemaining > 14) {
      return emojis[10];
    } else if (percentageRemaining > 12) {
      return emojis[11];
    } else if (percentageRemaining > 10) {
      return emojis[12];
    } else if (percentageRemaining > 8) {
      return emojis[13];
    } else if (percentageRemaining > 6) {
      return emojis[14];
    } else if (percentageRemaining > 4) {
      return emojis[15];
    } else if (percentageRemaining > 2) {
      return emojis[16];
    } else {
      return emojis[17];
    }
  }

  function getColor() {
    const percentageRemaining = (remainingTime / originalTime) * 100;
    const red = Math.min(255, Math.floor((100 - percentageRemaining) * 2.55));
    const green = Math.min(255, Math.floor(percentageRemaining * 2.55));
    return `rgb(${red}, ${green}, 0)`;
  }

  return (
    <div className="relative">
      <FollowerPointerCard ammo={ammo}>
        <div
          className={`${
            flashDamage
              ? "fixed bottom-4 right-4 w-48 cursor-crosshair rounded bg-red-500 p-4 font-mono shadow-md dark:bg-red-900"
              : "fixed bottom-4 right-4 w-48 cursor-crosshair rounded bg-white p-4 font-mono shadow-md dark:bg-gray-900"
          } select-none`}
          onClick={handleClick}
        >
          <div className="text-lg font-semibold">
            Timer: {formatTime(remainingTime)} {getEmoji()}
          </div>
          <div className="mt-2 h-4 w-full overflow-hidden rounded bg-gray-300">
            <div
              className="h-4 rounded"
              style={{
                width: `${(remainingTime / originalTime) * 100}%`,
                backgroundColor: getColor(),
              }}
            ></div>
          </div>
        </div>
        <AnimatePresence>
          {showDecrement && (
            <motion.div
              key="decrement"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -50 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="fixed bottom-16 right-6 text-3xl font-bold text-red-500"
            >
              {damageAmount}
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {flashDamage && (
            <motion.div
              key="ripple"
              initial={{ scale: 0, opacity: 0.7 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.75 }}
              className="absolute left-0 top-0 h-full w-full rounded bg-red-500"
            />
          )}
        </AnimatePresence>
      </FollowerPointerCard>
    </div>
  );
}
