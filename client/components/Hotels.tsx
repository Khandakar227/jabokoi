import { useEffect, useState } from "react"
import { Address } from "./ui/AutoComplete"
import { useTrip } from "@/hooks/use-trip";

interface HotelsProps {
    dest: Address
}


export default function Hotels({dest}:HotelsProps) {
    const [hotels, setHotels] = useState([]);

    useEffect(() => {
        fetch(`/api/getNearbyHotels?lat=${dest.location.lat}&long=${dest.location.lng}&arrival_date=2024-10-26&days_to_stay=1&room_qty=1`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setHotels(data.result);
        })
        .catch(err => console.log(err))
    }, [dest]);

  return (
    <div className="my-6 py-4 rounded-md shadow bg-neutral-800">
        <h2 className="font-bold text-3xl pb-4">Near by Hotels</h2>

        <div className="flex flex-wrap gap-4">
            {hotels.map((hotel, index) => (
                <HotelCard key={index} hotel={hotel} />
            ))}
        </div>
    </div>
  )
}


const HotelCard = ({ hotel }:{hotel: any}) => {
    const [trip, setTrip] = useTrip();

    const selectHotel = (hotel: any) => {
        setTrip({
            ...trip,
            hotel: {
              price: hotel.min_total_price * 120,
              name: hotel.hotel_name,
              room_qty: 1,
            },
        });
    }

    return (
    <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg p-6 mb-6 max-w-lg mx-auto w-full cursor-pointer"
    onClick={() => selectHotel(hotel)}>
      {/* Hotel Image */}
      <img
        src={hotel.main_photo_url}
        alt={hotel.hotel_name}
        className="w-full md:w-48 h-48 object-cover rounded-lg"
      />

      {/* Hotel Details */}
      <div className="md:ml-6 mt-4 md:mt-0">
        <h2 className="text-xl font-semibold text-gray-800">{hotel.hotel_name}</h2>
        <p className="text-gray-600">{hotel.city_in_trans}</p>
        
        <p className="text-gray-700 mt-2">
          Rating: <span className="font-semibold">{hotel.review_score}</span> ({hotel.review_score_word})
        </p>
        
        <p className="text-gray-700 mt-2">
          Price: <span className="font-semibold">৳{hotel.min_total_price * 120}</span> per night
        </p>

        {/* Free Cancellation */}
        {hotel.is_free_cancellable ? (
          <p className="text-green-600 font-semibold mt-2">Free Cancellation</p>
        ) : (
          <p className="text-red-600 font-semibold mt-2">No Free Cancellation</p>
        )}

        {/* Free Parking */}
        <p className="text-gray-700 mt-2">
          {hotel.has_free_parking ? 'Free Parking Available' : 'No Free Parking'}
        </p>

        <p className="text-blue-500 mt-2">{hotel.ribbon_text}</p>
      </div>
    </div>
  );
};
