import React, { useState, useEffect } from "react";
import KeenSlider, { KeenSliderInstance } from "keen-slider";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { VideoGenerator } from "./videoGenerator";

const TripSummary: React.FC = () => {
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);

  const galleryImages = [
    {
      id: 1,
      src: "/icons/agun.jpg",
      alt: "Trip Image 1",
    },
    {
      id: 2,
      src: "/icons/ice.jpeg",
      alt: "Trip Image 2",
    },
    {
      id: 3,
      src: "https://via.placeholder.com/600x400?text=Image+3",
      alt: "Trip Image 3",
    },
  ];

  useEffect(() => {
    const gallaryCarousel = new KeenSlider("#gallary-carousel", {
      loop: true,
      mode: "snap",
      rtl: false,
      slides: { perView: "auto", spacing: 16 },
    });

    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, []);

  const handleGenerateVlog = async () => {
    setGeneratingVideo(true);
    setGenerationProgress(0);
  
    try {
      const videoGenerator = new VideoGenerator(1280, 720); // 16:9 aspect ratio
      const imageSources = galleryImages.map(img => img.src);
      
      await videoGenerator.prepareFrames(imageSources, 4); // 4 seconds per image
      
      const videoBlob = await videoGenerator.generateVideo((progress) => {
        setGenerationProgress(progress);
      });
  
      const url = URL.createObjectURL(videoBlob);
      setVideoUrl(url);
    } catch (error) {
      console.error('Error generating video:', error);
      // Handle error appropriately
    } finally {
      setGeneratingVideo(false);
    }
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
            <h2 className="text-2xl font-semibold">Trip Vlog</h2>
            <Button 
              onClick={handleGenerateVlog}
              disabled={generatingVideo}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {generatingVideo ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating ({Math.round(generationProgress * 100)}%)
                </>
              ) : (
                'Generate Vlog'
              )}
            </Button>
          </div>
          
          {videoUrl && (
            <div className="aspect-video w-full bg-neutral-100 rounded-lg overflow-hidden">
              <video 
                controls 
                className="w-full h-full"
                src={videoUrl}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </section>

        <section className="gallery-section">
          <h2 className="text-2xl font-semibold mb-6">Gallery</h2>
          <div id="gallary-carousel" className="keen-slider">
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
        </section>
      </div>
    </div>
  );
};

export default TripSummary;


