import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

function getMessage() {
  let failureMessages = [
    {
      game: "Grand Theft Auto",
      note: "Mission Accomplished",
      image: "/gta.webp",
    },
    {
      game: "Call of Duty",
      note: "Mission Complete, Great Job!",
      image: "/call-of-duty.webp",
    },
    {
      game: "Oregon Trail",
      note: "You Have Successfully Reached Oregon",
      image: "/oregon-trail.webp",
    },
    {
      game: "Metal Gear Solid",
      note: "Mission Complete, Well Done Snake!",
      image: "/mgs.webp",
    },
    {
      game: "Street Fighter",
      note: "You Win!",
      image: "/street-fighter.webp",
    },
    {
      game: "XCOM",
      note: "Mission Successful, Squad Victorious",
      image: "/xcom.webp",
    },
    {
      game: "Diablo",
      note: "You Have Defeated the Lord of Terror",
      image: "/diablo.webp",
    },
    {
      game: "Fable",
      note: "Quest Complete, Hero of Albion",
      image: "/fable.webp",
    },
    {
      game: "Mass Effect",
      note: "Mission Accomplished, Galaxy Saved",
      image: "/mass-effect.webp",
    },
    {
      game: "Borderlands",
      note: "Vault Hunter, Mission Complete",
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
