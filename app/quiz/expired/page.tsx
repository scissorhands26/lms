import { Button } from "@/components/ui/button";
import Link from "next/link";

function getMessage() {
  let failureMessages = [
    { game: "Grand Theft Auto", note: "Wasted", popularity: 10, emoji: "🚗💥" },
    {
      game: "Call of Duty",
      note: "Mission Failed",
      popularity: 7,
      emoji: "💣🎯",
    },
    {
      game: "Oregon Trail",
      note: "You Have Died of Dysentery",
      popularity: 9,
      emoji: "🌾💀",
    },
    {
      game: "Metal Gear Solid",
      note: "Snake? Snake! SNAKE!",
      popularity: 8,
      emoji: "🐍🔫",
    },
    { game: "Street Fighter", note: "You Lose", popularity: 7, emoji: "🥋👊" },
    { game: "XCOM", note: "Squad Wiped Out", popularity: 8, emoji: "👽🔫" },
    {
      game: "Diablo",
      note: "Your Deeds of Valor Will Be Remembered",
      popularity: 8,
      emoji: "🔥👹",
    },
    {
      game: "Fable",
      note: "Reload Last Checkpoint",
      popularity: 7,
      emoji: "🔄🏰",
    },
    {
      game: "Mass Effect",
      note: "Critical Mission Failure",
      popularity: 7,
      emoji: "🚀💥",
    },
    {
      game: "Borderlands",
      note: "Fight for Your Life",
      popularity: 7,
      emoji: "🤠🔫",
    },
  ];

  let randomIndex = Math.floor(Math.random() * failureMessages.length);

  let randomFailureMessage = failureMessages[randomIndex];

  return randomFailureMessage;
}

export default function ExpiredQuizPage() {
  let randomFailureMessage = getMessage();

  return (
    <div className="container mx-auto mt-40 flex flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold">
        {randomFailureMessage.note} {randomFailureMessage.emoji}
      </h1>
      <p>({randomFailureMessage.game})</p>
      <Link href={"/"}>
        <Button>Go Home</Button>
      </Link>
    </div>
  );
}
