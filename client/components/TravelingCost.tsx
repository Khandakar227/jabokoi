import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMaxBusFare, getMaxTrainFare, getMinBusFare, getMinTrainFare } from "@/lib/utils";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode } from "react";

interface TravellingProps {
    busList: any[];
    trainList: any[];
}

export default function TravelingCost({busList, trainList}:TravellingProps) {

    return (
    <div className="w-full">
    <h2 className="font-bold text-3xl pb-4">Travelling Cost</h2>
    <Tabs defaultValue="Bus" className="bg-neutral-800 py-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="Bus" className="text-xl">Bus</TabsTrigger>
        <TabsTrigger value="Train" className="text-xl">Train</TabsTrigger>
      </TabsList>
      <TabsContent value="Bus">
        <p className="py-5 px-4 text-2xl">
        Cost range for Bus: <b>৳{+getMinBusFare(busList)} - ৳{+getMaxBusFare(busList)}</b>
        </p>
        {
            busList.map((bus, index) => {
                return (
                <div key={index + bus.company_id + Math.random()} className="flex items-center gap-4 py-2 px-4 shadow shadow-gray-600 m-2 rounded-md bg-zinc-950">
                    <img src={bus.company_logo_url} alt={bus.company_name} className="w-20"/>
                    <div className="flex-auto">
                        <div className="w-full flex justify-between items-center gap-4">
                            <p className="font-semibold">{bus?.company_name}</p>
                            <p className="font-semibold text-lg">{bus?.business_class_fare == 0 ? 'N/A' : '৳'+bus?.business_class_fare}</p>
                        </div>
                        <p className="text-sm">Departure Time: {bus?.departure_time}</p>
                        <p className="mt-6 text-xs">Trip Heading: {bus?.trip_heading}</p>
                    </div>
                </div>
                )
            })
        }
      </TabsContent>
      <TabsContent value="Train">
        <p className="py-5 px-4 text-2xl">
        Cost range for Train: <b>৳{+getMinTrainFare(trainList)} - ৳{+getMaxTrainFare(trainList)}</b>
        </p>
        {
            trainList.map((train, index) => (
                <div key={index + "t"} className="py-2 px-4 shadow shadow-gray-600 m-2 rounded-md bg-zinc-950">
                    <p className="text-2xl font-bold">{train?.trip_number}</p>
                    <div className="flex-auto flex gap-4 items-center justify-start pt-4">
                    {
                        train?.seat_types?.map((seat: any, _index: any) => (
                            <div key={index+ _index + seat?.type} className="rounded bg-neutral-800 p-4">
                                <p className="text-gray-200">{seat?.type}</p>
                                <p className="font-bold">{seat?.fare == 0 ? 'N/A' : '৳'+seat?.fare}</p>
                            </div>
                        ))
                    }
                    </div>
                </div>
                )
            )
        }
      </TabsContent>
      </Tabs>
    </div>
  )
}
