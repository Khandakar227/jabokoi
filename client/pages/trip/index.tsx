import Layout from "@/components/common/Layout";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { useState, useEffect } from "react";
import { ITrip } from "@/lib/models/trip"; // Import your Trip type
import { useRouter } from "next/router";


const MyPage = () => {
  const [trips, setTrips] = useState<ITrip[]>([]); // State to hold trips data
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch("/api/trips");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: ITrip[] = await response.json(); // Assuming the response is an array of Trip objects
        setTrips(data);
      } catch (error) {
        console.error("Error fetching trips:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const router = useRouter(); 
  const handleCardClick = (trip: ITrip) => {
    console.log(`Clicked on trip: ${trip.id}`);
    router.push(`/trip/${trip.id}`);

    // Add navigation or modal logic here
  };
  // Create carousel items dynamically
  const carouselItems = trips?.map((trip) => (
    <Card
      key={trip.id} // Use a unique key for each card
      card={{
        // src: trip.cover_photo, // Assuming each trip has a cover_photo field
        src:"",
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
