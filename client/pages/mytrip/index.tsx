import React, { useState, useEffect } from "react";
import KeenSlider, { KeenSliderInstance } from "keen-slider";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { VideoGenerator } from "./videoGenerator";
import { imageServer } from "@/lib/const";

const TripSummary: React.FC = () => {
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);

  const [galleryImages, setGallaeryImages] = useState([] as any);

  useEffect(() => {
    fetch(imageServer+"/images?user_id=671a2e6ddbc951827deda3ff&album_id=671a2e6ddbc")
    .then(res => res.json())
    .then(data => {
      setGallaeryImages(data.images.map((d:string, i:number) => {
        return {
          id: i,
          src: imageServer + "/" + d,
          alt: "Trip Image " + i,
        }
      }));
    }).catch(err => {
      console.log(err);
    });
  }, []);


  const handleGenerateVlog = async () => {
    setGeneratingVideo(true);
    setGenerationProgress(0);
  
    try {
      console.log(galleryImages)
      const videoGenerator = new VideoGenerator(1280, 720); // 16:9 aspect ratio
      const imageSources = galleryImages.map((img:any) => img.src);
      
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
          <div id="gallary-carousel" className="flex items-center justify-center gap-4 flex-wrap">
            {galleryImages.map((image:any) => (
              <div key={image.id} className="max-w-80">
                <img 
                  src={image.src} 
                  alt={""} 
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

