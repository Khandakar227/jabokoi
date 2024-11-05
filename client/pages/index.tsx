import Image from "next/image";
import Layout from "@/components/common/Layout";
import { Boxes } from "@/components/common/BackgroundBox";
import Markdown from "react-markdown";
import {
  cn,
  formatDate,
  getBusRoutes,
  getShohozSignIn,
  getTrainRoutes,
} from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import LocationSearch from "@/components/common/LocationSearch";
import { Label } from "@/components/ui/label";
import { MouseEvent, useEffect, useMemo, useState } from "react";
import { Address } from "@/components/ui/AutoComplete";
import Spinner from "@/components/common/Spinner";
import TravelingCost from "@/components/TravelingCost";
import Hotels from "@/components/Hotels";
import { calcRoute, initMap } from "../lib/route";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { ThermometerSun, ThermometerSnowflake, Wind, CloudRainWind } from 'lucide-react';
import { useTrip } from "@/hooks/use-trip";
import { imageServer } from "@/lib/const";

interface Weather {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export default function Home() {
  const [fromAddress, setFromAddress] = useState({} as Address);
  const [toAddress, setToAddress] = useState({} as Address);
  const [busList, setBusList] = useState([]);
  const [trainList, setTrainList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [weather, setWeather] = useState({} as any);
  const [error, setError] = useState("");
  const [itineraryText, setItineraryText] = useState("");

  const [trip, setTrip] = useTrip();

  const totalCost = useMemo(() => {
    return parseFloat(trip.vehicle?.price?.toString() || "0") + parseFloat((trip.hotel?.price * trip.hotel?.room_qty)?.toString() || "0");
  }, [trip]);

  useEffect(() => {
    console.log(trip);
  }, [trip]);

  useEffect(() => {
    getShohozSignIn();
  }, [])



  const fetchWeather = async () => {
    if (!toAddress?.location) return; // Ensure toAddress has location
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${toAddress.location.lat}&lon=${toAddress.location.lng}&appid=${process.env.NEXT_PUBLIC_WEATHER_API}&units=metric`);
      const data = await response.json();

        console.log(data);
        setWeather(data); // Set weather data
        setError(""); // Clear any previous errors
      
    } catch (error) {
      setError("Failed to fetch weather data"); // Handle fetch error
    }
  };

  const onSearch = async () => {
    if (!fromAddress.division || !toAddress.division || !toAddress?.district)
      return;
    setTrip({
      ...trip,
      source: fromAddress.name as string,
      destination: toAddress.name as string,
      vehicle: {
        name: "",
        price: 0,
        type: "",
      },
      hotel: {
        name: "",
        price: 0,
        room_qty: 0,
      },
    });

    setLoading(true);
    const busTrips = await getBusRoutes(
      fromAddress?.division,
      toAddress?.division == fromAddress?.division
        ? toAddress?.district
        : toAddress?.division,
      formatDate(new Date())
    );

    setBusList(busTrips?.list || []);
    // remove elements that have no business class fare or business fare is 0
    setBusList((b) => b.filter((bus: any) => bus.business_class_fare > 0));
    console.log(busTrips?.list || []);
    //Tomorrow date
    const trainTrips = await getTrainRoutes(
      fromAddress?.division,
      toAddress?.division == fromAddress?.division
        ? toAddress?.district
        : toAddress?.division,
      formatDate(new Date(Date.now() + 24 * 60 * 60 * 1000)),
      "SNIGDHA"
    );
    setTrainList(trainTrips || []);
    setLoaded(true);
    setLoading(false);

    await fetchWeather();    
    initMap();
    calcRoute(
      fromAddress.location.lat,
      fromAddress.location.lng,
      toAddress.location.lat,
      toAddress.location.lng
    );
  };

  const createTrip = async (e:MouseEvent) => {
    (e.target as HTMLButtonElement).disabled = true;
    (e.target as HTMLButtonElement).innerText = "Creating Trip...";
    try {
      
      if(!trip.source || !trip.destination || !trip.vehicle.name || !trip.hotel.name) return;

      const res = await fetch("/api/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: "615f9f9b5c1d6c4d3d7f6d0f",
          source: trip.source,
          destination: trip.destination,
          vehicle: trip.vehicle,
          hotel: trip.hotel,
        }),
      });
      const data = await res.json();
      console.log(data);
      (e.target as HTMLButtonElement).disabled = false;
      (e.target as HTMLButtonElement).innerText = "Create a Trip";
      setTrip({
        ...trip,
        source: "",
        destination: "",
      })
      generateItinerary();
    } catch (error) {
      console.log(error)
    } finally {
      (e.target as HTMLButtonElement).disabled = false;
      (e.target as HTMLButtonElement).innerText = "Create a Trip";
    }
  }

  function generateItinerary() {
    const userId = "671a2e6ddbc951827deda3ff";
    const albumId = "671a2e6ddbc";

    fetch(`${imageServer}/generate-travel-itinerary`, {
      body: JSON.stringify({ user_id:userId, album_id:albumId, trip_info_json: JSON.stringify(trip) }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setItineraryText(data.result);
        console.log(data);
      });
  }

  return (
    <Layout>
      <div className="p-4">
        <div className="min-h-96 relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center rounded-lg py-12">
          <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
          <Boxes />
          <h1
            className={cn(
              "md:text-5xl text-2xl text-white relative z-20 font-bold pt-20"
            )}
          >
            Welcome to JaboKoi
          </h1>
          <p className="text-center mt-2 text-neutral-300 relative z-20 max-w-2xl mx-auto">
            Discover personalized travel itineraries crafted just for you. From
            pristine beaches to mountain peaks, we'll help you explore
            Bangladesh like never before.
          </p>

          <div className={cn("text-white relative z-20 pt-5")}>
            <div className="flex gap-4 justify-evenly items-center flex-wrap">
              <div>
                <p className="text-lg">From: </p>
                <LocationSearch
                  placholder="Start your journey..."
                  setAddress={setFromAddress}
                />
              </div>
              <div>
                <p className="text-lg">To: </p>
                <LocationSearch setAddress={setToAddress} />
              </div>
            </div>
            <div className="mx-auto text-center">
              <Button
                className="bg-blue-600 text-white py-2 px-2 rounded"
                onClick={onSearch}
              >
                <Search size={20} /> Get Trip Plan
              </Button>
            </div>
          </div>
        </div>

        <div className="flex">
        <div id="map" style={{ height: '500px', width: '80%', borderRadius: '12px', margin: '0 auto' }}></div>
          <div className="weather-info" style={{ width: '30%', padding: '10px' }}>
            {loading && <Spinner />}
            {error && <div className="text-red-500">{error}</div>}
            <div className="flex items-center space-x-2">

          </div>
            {weather?.weather?.length && (
              <div className="bg-black p-4 rounded-lg shadow-lg">
                <h2 className="font-bold text-lg">{weather.name}</h2>
                <div className = "flex items-center">
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                    alt={weather.weather[0].description}
                    width="50"
                    height="50"
                    /> {weather.weather[0].description}
                </div>

                <div className = "flex items-center pb-1 gap-2">
                  <ThermometerSun/>
                  <b>{weather.main.temp} °C</b>
                </div>


                <div className = "flex items-center pb-1 gap-2">
                  <ThermometerSnowflake/>
                  <b>{weather.main.feels_like} °C</b>
                </div>

                <div className = "flex items-center pb-1 gap-2">
                  <CloudRainWind/>
                  <b>{weather.main.humidity}%</b>
                </div>

                <div className = "flex items-center space-between gap-2">
                  <Wind/>
                  <b>{weather.wind.speed} m/s</b> 
                </div>

              </div>
            )}
          </div>

        </div>

        <div className="py-8">
          {loading && (
            <div className="w-full h-96 flex items-center justify-center">
              <Spinner />
            </div>
          )}
          {loaded && (
            <>
              {/* <Tabs>
                <TabsTrigger value="TravelingCost"> <h2 className="text-xl">Traveling Cost</h2> </TabsTrigger>
                <TabsTrigger value="Hotels"> <h2 className="text-xl">Hotels</h2> </TabsTrigger>
                <TabsContent value="TravelingCost">
                </TabsContent>
                
                <TabsContent value="Hotels">
                </TabsContent>
              </Tabs> */}
              <TravelingCost busList={busList} trainList={trainList} />
              <Hotels dest={toAddress} />

              {
                itineraryText && (
                <div className="py-12">
                  <h1 className="text-2xl font-bold">Travel Itinerary</h1>
                  <div className="whitespace-pre-wrap py-6"><Markdown>{itineraryText}</Markdown></div>
                </div>
                  )
              }
            </>
          )}
        </div>
      </div>

      {trip.source && trip.destination && (
        <div className="p-4 fixed bottom-0 right-0 z-20">
          <div className="py-2 px-4 shadow bg-gray-600 rounded-md">
            <h2 className="font-bold text-xl pb-4">My Trip</h2>
            <div className="flex flex-col gap-2">
              <div className="bg-neutral-800 p-4 rounded-md shadow">
                <h2 className="text-xs pb-2">From: {trip.source}</h2>
                <h2 className="text-xs pb-2">To: {trip.destination}</h2>
              </div>
              {trip.vehicle.name && (
                <div className="bg-neutral-800 p-2 rounded-md shadow">
                  <h2 className="text-xs pb-2">
                    {trip.vehicle.type.toUpperCase()}: {trip.vehicle?.name}
                  </h2>
                  <h2 className="text-xs pb-2">Price: {trip.vehicle?.price}</h2>
                </div>
              )}
              {trip.hotel.name && (
                <div className="bg-neutral-800 p-2 rounded-md shadow">
                  <h2 className="text-xs pb-2">Hotel: {trip.hotel?.name}</h2>
                  <h2 className="text-xs pb-2">Price: ৳{trip.hotel?.price}</h2>
                  <h2 className="text-xs pb-2">
                    Room count: {trip.hotel?.room_qty}
                  </h2>
                </div>
              )}
              {
              totalCost ? (
                <div className="bg-neutral-800 p-2 rounded-md shadow">
                  <h2 className="text-xs pb-2">Total Cost: <b>৳{totalCost}</b></h2>
                </div>
              ) : ""
              }
              <div>
                <Button className="bg-blue-600 text-white py-2 px-2 rounded text-xs" onClick={createTrip}>
                  Create a Trip
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
