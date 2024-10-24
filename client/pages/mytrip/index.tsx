"use client";

import React, { useState, useEffect } from "react";
import KeenSlider, { KeenSliderInstance } from "keen-slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const gallaryArrowsInit = (slider: KeenSliderInstance) => {
  const leftArrow = document.getElementById("gallary-left-arrow");
  const rightArrow = document.getElementById("gallary-right-arrow");

  if (leftArrow) leftArrow.addEventListener("click", () => slider.prev());
  if (rightArrow) rightArrow.addEventListener("click", () => slider.next());
};

const addDots = (slider: KeenSliderInstance, wrapperSelector: string) => {
  const dots = document.createElement("div");
  dots.className = "dots";
  const wrapper = document.querySelector(wrapperSelector);

  if (wrapper) {
    while (wrapper.firstChild) {
      wrapper.removeChild(wrapper.firstChild);
    }

    slider.track.details.slides.forEach((_e, idx) => {
      const dot = document.createElement("div");
      dot.className = "dot";
      if (idx === 0) dot.classList.add("dot--active");
      dot.addEventListener("click", () => slider.moveToIdx(idx));
      dots.appendChild(dot);
    });

    const updateClasses = () => {
      const slide = slider.track.details.rel;
      Array.from(dots.children).forEach((dot, idx) => {
        if (dot instanceof HTMLElement) {
          idx === slide
            ? dot.classList.add("dot--active")
            : dot.classList.remove("dot--active");
        }
      });
    };

    wrapper.appendChild(dots);

    slider.on("created", updateClasses);
    slider.on("optionsChanged", updateClasses);
    slider.on("slideChanged", updateClasses);
  }
};

const TripSummary: React.FC = () => {
  const vlogs = [
    {
      id: 1,
      title: "Vlog 1",
      url: "https://www.youtube.com/embed/your_dummy_video_url1",
    },
    {
      id: 2,
      title: "Vlog 2",
      url: "https://www.youtube.com/embed/your_dummy_video_url2",
    },
  ];

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

  useEffect(() => {
    const gallaryCarousel = new KeenSlider("#gallary-carousel", {
      loop: true,
      mode: "snap",
      rtl: false,
      slides: { perView: "auto", spacing: 16 },
    });

    gallaryArrowsInit(gallaryCarousel);
    addDots(gallaryCarousel, ".gallary-dots-header");
  }, []);

  return (
    <div className="trip-summary">
      <h1>Trip Summary</h1>

      <Tabs defaultValue="vlogs" className="bg-neutral-800">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vlogs">Vlogs</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
        </TabsList>

        <TabsContent value="vlogs">
          <div className="vlog-section">
            <h2>Vlogs</h2>
            <div className="vlogs">
              {vlogs.map((vlog) => (
                <div key={vlog.id} className="vlog-item">
                  <h3>{vlog.title}</h3>
                  <iframe
                    width="560"
                    height="315"
                    src={vlog.url}
                    title={vlog.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="gallery">
          <div className="gallery-section">
            <h2>Gallery</h2>
            <div id="gallary-carousel" className="keen-slider flex">
              {galleryImages.map((image) => (
                <div key={image.id} className="keen-slider__slide">
                  <img src={image.src} alt={image.alt} />
                </div>
              ))}
            </div>
            <div className="gallary-dots-header"></div>
          </div>
        </TabsContent>
      </Tabs>

      <style jsx>{`
        .tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .tabs button {
          padding: 10px 20px;
          cursor: pointer;
          border: none;
          background-color: #f0f0f0;
          border-radius: 5px;
        }

        .active-tab {
          background-color: #0070f3;
          color: white;
        }

        .vlog-section,
        .gallery-section {
          margin-top: 20px;
        }

        .vlog-item {
          margin-bottom: 20px;
        }

        .tab-content {
          min-height: 300px;
        }
      `}</style>
    </div>
  );
};

export default TripSummary;



