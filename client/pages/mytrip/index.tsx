import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";


const TripSummary: React.FC = () => {
  const [vlogs, setVlogs] = useState<Array<{ id: number; title: string; url: string }>>([]);

  const galleryImages = [
    {
      id: 1,
      src: "https://via.placeholder.com/600x400?text=Image+1",
      alt: "Trip Image 1",
    },
    {
      id: 2,
      src: "https://via.placeholder.com/600x400?text=Image+2",
      alt: "Trip Image 2",
    },
    {
      id: 3,
      src: "https://via.placeholder.com/600x400?text=Image+3",
      alt: "Trip Image 3",
    },
  ];

  const handleGenerateVlog = () => {
    const newVlog = {
      id: vlogs.length + 1,
      title: `Vlog ${vlogs.length + 1}`,
      url: `https://www.youtube.com/embed/your_dummy_video_url${vlogs.length + 1}`,
    };
    setVlogs([...vlogs, newVlog]);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-12">Trip Summary</h1>
      
      <div className="flex justify-center items-center space-x-4 mb-12">
        <div className="text-lg">
          <span className="font-semibold">From:</span> Dhaka
        </div>
        <div className="text-2xl">→</div>
        <div className="text-lg">
          <span className="font-semibold">To:</span> Gazipur
        </div>
      </div>

      <div className="space-y-12">
        <section className="vlog-section">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Vlogs</h2>
            <Button 
              onClick={handleGenerateVlog}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Generate Vlog
            </Button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {vlogs.map((vlog) => (
              <div key={vlog.id} className="vlog-item bg-neutral-100 rounded-lg p-4">
                <h3 className="text-xl font-medium mb-3">{vlog.title}</h3>
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full rounded-lg"
                    src={vlog.url}
                    title={vlog.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="gallery-section">
          <h2 className="text-2xl font-semibold mb-6">Gallery</h2>
          <div id="gallary-carousel" className="keen-slider flex">
            {galleryImages.map((image) => (
              <div key={image.id} className="keen-slider__slide">
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="rounded-lg w-full h-auto"
                />
              </div>
            ))}
          </div>
          <div className="gallary-dots-header flex justify-center mt-4 space-x-2">
            {/* Dots will be inserted here by the addDots function */}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TripSummary;


