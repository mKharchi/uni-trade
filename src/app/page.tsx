import Image from "next/image";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div className="bg-background flex flex-col items-center justify-start text-2xl w-full min-h-screen text-foreground">
        <Navbar/>
      welcome to Uni-trade
    </div>
  );
}
