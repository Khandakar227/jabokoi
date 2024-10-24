import Image from "next/image";
import Layout from "@/components/common/Layout";
import { Boxes } from "@/components/common/BackgroundBox";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function Home() {
  return (
    <Layout>
      <div className="p-4">
        <div className="h-96 relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center rounded-lg">
          <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
          <Boxes />
          <h1 className={cn("md:text-5xl text-2xl text-white relative z-20 font-bold")}>
            Welcome to JaboKoi
          </h1>
          <p className="text-center mt-2 text-neutral-300 relative z-20 max-w-2xl mx-auto">
          Discover personalized travel itineraries crafted just for you. From pristine beaches to mountain peaks, we'll help you explore Bangladesh like never before.
          </p>

          <div className={cn("text-white relative z-20 pt-5 flex gap-4 justify-between items-center")}>
            <Input type="search" placeholder="Search A Place You Want To Visit..." className="w-full max-auto min-w-96 bg-white text-black" />
            <Button className="bg-blue-500"><Search/></Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
