import Layout from "@/components/common/Layout";
import Spinner from "@/components/common/Spinner";
import { MySlideshow } from "@/components/common/Video";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { Button } from "@/components/ui/button";
import LayoutGrid from "@/components/ui/layout-grid";
import { useUser } from "@/hooks/use-user";
import { imageServer } from "@/lib/const";
import { Player } from "@remotion/player";
import { useRouter } from "next/router";
import { useState, useEffect, ChangeEvent, useRef } from "react";

const Trip = () => {
  const router = useRouter();
  const { trip_id } = router.query;
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [blogText, setBlogText] = useState<string>("");

  const [images, setImages] = useState<string[]>([]);
  interface Card {
    id: number;
    content: string;
    className: string;
    thumbnail: string;
  }

  const [cards, setCards] = useState<Card[]>([]);
  const [user, _] = useUser();
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const [subtitles, setSubtitles] = useState([] as any[]);

  const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    setLoading(true);

    if (!file || !user?._id || !router.query.trip_id) return;
    const form = new FormData();
    form.append("user_id", user?._id as string);
    form.append("album_id", router.query.trip_id as string);
    form.append("image", file);
    fetch(imageServer + "/add_image", {
      method: "POST",
      body: form,
    })
      .then((res) => res.json())
      .then((res) => {
        setCards((cs) => {
          cs.push({
            id: cs.length + 1,
            content: "",
            className: "",
            thumbnail: imageServer + "/" + res.image_path,
          });
          return cs;
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!user?._id || !router.query?.trip_id) return;
    fetch(
      `${imageServer}/images?user_id=${user?._id}&album_id=${router.query?.trip_id}`
    )
      .then((res) => res.json())
      .then((data) => {
        setImages(
          data?.images?.map((d: string) => imageServer + "/" + d) || []
        )
        setCards((cs) => {
          return (
            data?.images?.map((d: string, i: number) => {
              return {
                id: i,
                content: "",
                className: "",
                thumbnail: imageServer + "/" + d,
              };
            }) || []
          );
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [router.query?.trip_id, user?._id]);

  useEffect(() => {
    if (trip_id) {
      fetch(`/api/trips/${trip_id}`)
        .then((res) => res.json())
        .then((data) => {
          setTrip(data);
          setBlogText(data.blog);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [trip_id]);

  useEffect(() => {
    console.log(images);
  }, [images]);

  useEffect(() => {
    setSubtitles(paragraphToSubtitles(blogText))
  }, [blogText])

  function generateBlog() {
    fetch(`${imageServer}/generate-travel-blog`, {
      body: JSON.stringify({
        user_id: user?._id,
        album_id: router.query.trip_id,
        trip_info_json: JSON.stringify(trip),
      }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setBlogText(data.result);
        setTrip((t:any) => ({...t, blog: data.result}));
        console.log(data);
      });
  }

  function saveBlog() {
    fetch(`/api/trips/${trip_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ blog: blogText }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTrip(data);
        setBlogText(data.blog);
        setLoading(false);
      });
  }

  function onBlogChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setBlogText(e.target.value);
    e.target.style.height = e.target.scrollHeight + "px";
  }

  const handleFileUpload = () => {
    fileUploadRef.current?.click();
  };

  function paragraphToSubtitles(paragraph:string, durationPerSentence = 90) {
    // Regular expression to split sentences
    const sentences = paragraph.match(/[^.!?]+[.!?]*/g);
  
    // Generate subtitle objects with text, startFrame, and durationInFrames
    const subtitles = sentences
      ? sentences.map((sentence, index) => ({
          text: sentence.trim(),
          startFrame: index * durationPerSentence,
          durationInFrames: durationPerSentence,
        }))
      : [];
  
    return subtitles;
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
            <div className="py-6 text-center pt-12 flex gap-4 justify-center items-center">
              <Button className="bg-blue-500" onClick={generateBlog}>
                {blogText ? "Regenerate Blog" : "Generate a Blog"}
              </Button>
              {trip?.blog != blogText && (
                <Button className="bg-blue-900" onClick={saveBlog}>
                  Save
                </Button>
              )}
            </div>

            {blogText && (
              <div className="px-4 pt-12 rounded-lg">
                <textarea
                  onChange={onBlogChange}
                  value={blogText}
                  className="whitespace-break-spaces w-full h-full bg-neutral-800 p-4 outline-none rounded-xl min-h-80"
                >
                </textarea>
              </div>
            )}
            <h1 className="text-3xl font-bold pt-12">Galleries</h1>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 justify-center items-stretch px-4">
              <div
                className="bg-blue-600 cursor-pointer font-bold rounded-xl flex justify-center items-center"
                onClick={handleFileUpload}
              >
                {loading ? (
                  <Spinner />
                ) : (
                  <div className="text-white text-6xl">+</div>
                )}
                <input
                  type="file"
                  name="image"
                  id="image"
                  className="hidden"
                  ref={fileUploadRef}
                  onChange={onFileUpload}
                />
              </div>
              {cards?.map((card: any, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden bg-blue-500 rounded-xl h-full w-full flex justify-center items-center cursor-pointer min-h-[300px]"
                >
                  <img
                    src={card.thumbnail}
                    alt="image"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <h1 className="text-3xl font-bold pt-12 px-4">Generate a Vlog</h1>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
      <Player
        component={() => <MySlideshow images={images} subtitles={subtitles}/>}
        durationInFrames={300}
        compositionWidth={500}
        compositionHeight={420}
        fps={30}
        controls
        autoPlay={false}
        loop
      />
    </div>
    </Layout>
  );
};

export default Trip;
