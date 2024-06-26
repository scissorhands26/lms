import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

function getMessage() {
  let failureMessages = [
    {
      game: "Grand Theft Auto",
      note: "Wasted",
      image: "/gta.webp",
    },
    {
      game: "Call of Duty",
      note: "Mission Failed, We'll Get Em Next Time!",
      image: "/call-of-duty.webp",
    },
    {
      game: "Oregon Trail",
      note: "You Have Died of Dysentery",
      image: "/oregon-trail.webp",
    },
    {
      game: "Metal Gear Solid",
      note: "Snake? Snake! SNAKE!",
      image: "/mgs.webp",
    },
    {
      game: "Street Fighter",
      note: "You Lose",
      image: "/street-fighter.webp",
    },
    { game: "XCOM", note: "Squad Wiped Out", image: "/xcom.webp" },
    {
      game: "Diablo",
      note: "Your Deeds of Valor Will Be Remembered",
      image: "/diablo.webp",
    },
    {
      game: "Fable",
      note: "Reload Last Checkpoint",
      image: "/fable.webp",
    },
    {
      game: "Mass Effect",
      note: "Critical Mission Failure",
      image: "/mass-effect.webp",
    },
    {
      game: "Borderlands",
      note: "Fight for Your Life",
      image: "/borderlands.webp",
    },
  ];

  let randomIndex = Math.floor(Math.random() * failureMessages.length);

  let randomFailureMessage = failureMessages[randomIndex];

  return randomFailureMessage;
}

export default function ExpiredQuizPage() {
  let randomFailureMessage = getMessage();
  let imagePath = randomFailureMessage.image as string;

  console.log(randomFailureMessage);
  console.log(imagePath);

  return (
    <div className="container mx-auto mt-40 flex flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold">{randomFailureMessage.note}</h1>
      <Image
        src={imagePath}
        alt={randomFailureMessage.game}
        width={400}
        height={400}
      />
      <p>({randomFailureMessage.game})</p>
      <Link href={"/"}>
        <Button>Go Home</Button>
      </Link>
    </div>
  );
}
