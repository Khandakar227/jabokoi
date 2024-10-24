import { useState } from "react";
import { MapProvider } from "@/components/common/MapProvider";
import AutoCompleteInput from "@/components/ui/AutoComplete";
import { Address } from "@/components/ui/AutoComplete";
import toast from "react-hot-toast";
import { Search } from "lucide-react";

interface LocationSearchProps {
  setLoading?: (loading: boolean) => void;
  placholder?: string;
  setAddress: (address: Address) => void;
  }

function LocationSearch({
  placholder,
  setAddress
}: LocationSearchProps) {


  const onSetAddress = (address: Address) => {
    console.log(address);
    setAddress(address);
  };

  return (
    <MapProvider>
      <div className="mb-6 mx-auto flex gap-4 justify-center items-center">
        <AutoCompleteInput
          as="row"
          className="md:min-w-[500px] text-black mt-1 block w-full px-3 py-2 border bg-slate-100 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder={placholder || "Search Places You Want to Visit..."}
          setAddress={onSetAddress}
        />
      </div>
    </MapProvider>
  );
}

export default LocationSearch;
