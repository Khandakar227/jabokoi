import Layout from "@/components/common/Layout";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { useState, useEffect } from "react";
import { ITrip } from "@/lib/models/trip"; // Import your Trip type
import { useRouter } from "next/router";
import { getTouristSpots } from "@/lib/utils";


interface TripProp extends ITrip {
  id: string
}

const MyPage = () => {
  const [trips, setTrips] = useState<TripProp[]>([]); // State to hold trips data
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch("/api/trips");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: ITrip[] = await response.json(); // Assuming the response is an array of Trip objects
        setTrips(data as any);
        data.forEach(async (d) => {
        await fetch(`/api/image?locationName=${d.destination}`)
        .then(res => res.json())
        .then(data => {
          setTrips( ts => ts.map((t) => {
            if(t.destination == d.destination) t.cover_photo = data.image;
            return t;
          }));
        }).catch(err => {
          console.log(err);
        });
      });

      } catch (error) {
        console.error("Error fetching trips:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const router = useRouter(); 
  const handleCardClick = (trip: TripProp) => {
    

  };

  // Create carousel items dynamically
  const carouselItems = trips?.map((trip) => (
    <Card
      key={trip.id} // Use a unique key for each card
      card={{
        category: trip.id,
        src: trip?.cover_photo,
        title: `${trip.source} to ${trip.destination}`, // Dynamic title based on trip info
        content: <p>{trip.blog || "No description available"}</p>, // Assuming there's a blog field for content
        
      }}
      onClick={() => handleCardClick(trip)}
      index={trips.indexOf(trip)} // Index based on the position in the array
    />
  ));

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-3xl font-bold">My Trips</h1>

        {
          trips.length != 0 ? (
            <Carousel items={carouselItems} initialScroll={0} />
          ) :
          <p className="text-center py-12"> It seems you haven't added any trips </p>
        }
      </div>
    </Layout>
  );
};

export default MyPage;
