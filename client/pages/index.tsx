import Image from "next/image";
import Layout from "@/components/common/Layout";
import { Boxes } from "@/components/common/BackgroundBox";
import { cn, formatDate, getBusRoutes, getShohozSignIn, getTrainRoutes } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import LocationSearch from "@/components/common/LocationSearch";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Address } from "@/components/ui/AutoComplete";
import Spinner from "@/components/common/Spinner";
import TravelingCost from "@/components/TravelingCost";

export default function Home() {
  const [fromAddress, setFromAddress] = useState({} as Address);
  const [toAddress, setToAddress] = useState({} as Address);
  const [busList, setBusList] = useState([]);
  const [trainList, setTrainList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getShohozSignIn();
  }, [])

  const onSearch = async () => {
    if(!fromAddress.division || !toAddress.division) return;
    setLoading(true);
    const busTrips = await getBusRoutes(fromAddress?.division, toAddress?.division, formatDate(new Date()));
    setBusList(busTrips?.list|| []);
    console.log(busTrips?.list|| []);
    //Tomorrow date
    const trainTrips = await getTrainRoutes(fromAddress?.division, toAddress?.division,
      formatDate(new Date(Date.now() + 24 * 60 * 60 * 1000)), "SNIGDHA");
    setTrainList(trainTrips|| []);
    setLoaded(true);
    setLoading(false);
  }

  return (
    <Layout>
      <div className="p-4">
        <div className="min-h-96 relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center rounded-lg py-12">
          <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
          <Boxes />
          <h1 className={cn("md:text-5xl text-2xl text-white relative z-20 font-bold pt-20")}>
            Welcome to JaboKoi
          </h1>
          <p className="text-center mt-2 text-neutral-300 relative z-20 max-w-2xl mx-auto">
          Discover personalized travel itineraries crafted just for you. From pristine beaches to mountain peaks, we'll help you explore Bangladesh like never before.
          </p>

          <div className={cn("text-white relative z-20 pt-5")}>
            <div className="flex gap-4 justify-evenly items-center flex-wrap">
              <div>
                <p className="text-lg">From: </p>
                <LocationSearch placholder="Start your journey..." setAddress={setFromAddress}/>
              </div>
              <div>
                <p className="text-lg">To: </p>
                <LocationSearch setAddress={setToAddress}/>
              </div>
            </div>
            <div className="mx-auto text-center">
              <Button className="bg-blue-600 text-white py-2 px-2 rounded" onClick={onSearch}>
                <Search size={20} /> Search
              </Button>
            </div>
          </div>
        </div>

        <div className="py-8">
          {
            loading && (
              <div className="w-full h-96 flex items-center justify-center">
                <Spinner/>
              </div>
            )
          }
          {
            loaded && (
              <TravelingCost busList={busList} trainList={trainList}/>
            )
          }
        </div>
      </div>
    </Layout>
  );
}
