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
import Hotels from "@/components/Hotels";
import { calcRoute, initMap } from '../lib/route';
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";

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
    if(!fromAddress.division || !toAddress.division || !toAddress?.district) return;
    setLoading(true);
    const busTrips = await getBusRoutes(fromAddress?.division, (toAddress?.division == fromAddress?.division ? toAddress?.district : toAddress?.division), formatDate(new Date()));
    setBusList(busTrips?.list|| []);
    // remove elements that have no business class fare or business fare is 0
    setBusList(b => b.filter((bus:any) => bus.business_class_fare > 0));
    console.log(busTrips?.list|| []);
    //Tomorrow date
    const trainTrips = await getTrainRoutes(fromAddress?.division, (toAddress?.division == fromAddress?.division ? toAddress?.district : toAddress?.division),
      formatDate(new Date(Date.now() + 24 * 60 * 60 * 1000)), "SNIGDHA");
    setTrainList(trainTrips|| []);
    setLoaded(true);
    setLoading(false);
    initMap();
    calcRoute(fromAddress.location.lat, fromAddress.location.lng, toAddress.location.lat, toAddress.location.lng);
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
                <Search size={20} /> Get Trip Idea
              </Button>
            </div>
          </div>
        </div>

        <div id="map" style={{ height: '500px', width: '80%', borderRadius: '12px', margin: '0 auto' }}></div>

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
              <>
              {/* <Tabs>
                <TabsTrigger value="TravelingCost"> <h2 className="text-xl">Traveling Cost</h2> </TabsTrigger>
                <TabsTrigger value="Hotels"> <h2 className="text-xl">Hotels</h2> </TabsTrigger>
                <TabsContent value="TravelingCost">
                </TabsContent>
                
                <TabsContent value="Hotels">
                </TabsContent>
              </Tabs> */}
                  <TravelingCost busList={busList} trainList={trainList}/>
                  <Hotels dest={toAddress} />
              </>
            )
          }
        </div>
      </div>
      

    </Layout>
  );
}
