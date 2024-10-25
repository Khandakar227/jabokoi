import Layout from "@/components/common/Layout";
import Spinner from "@/components/common/Spinner";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { Button } from "@/components/ui/button";
import { imageServer } from "@/lib/const";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const Trip = () => {
  const router = useRouter();
  const { trip_id } = router.query;
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [blogText, setBlogText] = useState<string>("");

  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (trip_id) {
      fetch(`/api/trips/${trip_id}`)
        .then((res) => res.json())
        .then((data) => {
          setTrip(data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [trip_id]);

  useEffect(() => {
    fetch(
      `${imageServer}/images?user_id=671a2e6ddbc951827deda3ff&album_id=671a2e6ddbc`
    )
      .then((response) => response.json())
      .then((response) => {
        response?.images?.map((p: string) => {
          setImages([...images, imageServer + "/" + p]);
        });
      })
      .catch((err) => console.error(err));
  }, [trip]);

  function generateBlog() {

    const userId = "671a2e6ddbc951827deda3ff";
    const albumId = "671a2e6ddbc";

    fetch(`${imageServer}/generate-travel-blog`, {
      body: JSON.stringify({ user_id:userId, album_id:albumId, trip_info_json: JSON.stringify(trip) }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setBlogText(data.result);
        console.log(data);
      });
  }

  return (
    <Layout>
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-center">
              {trip?.source}
              <br />
              to
              <br />
              {trip?.destination}
            </h1>
            <div className="py-6">
              <Button className="bg-blue-500" onClick={generateBlog}>
                Generate a Blog
              </Button>
            </div>

            {
              blogText && (
                <div className="px-4 pt-12 rounded-lg">
                  <p className="whitespace-break-spaces">{blogText}</p>
                </div>
              )
            }
          </>
        )}
      </div>
    </Layout>
  );
};

export default Trip;
