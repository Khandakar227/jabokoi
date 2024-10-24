import React, { useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Carousel styles

const TripSummary: React.FC = () => {
  // State for tab selection
  const [activeTab, setActiveTab] = useState<'vlogs' | 'gallery'>('vlogs');

  // Dummy vlog data
  const vlogs = [
    {
      id: 1,
      title: 'Vlog 1',
      url: 'https://www.youtube.com/embed/your_dummy_video_url1', // Replace with actual URLs
    },
    {
      id: 2,
      title: 'Vlog 2',
      url: 'https://www.youtube.com/embed/your_dummy_video_url2',
    },
  ];

  // Dummy gallery images
  const galleryImages = [
    {
      id: 1,
      src: 'https://via.placeholder.com/600x400?text=Image+1', // Replace with actual images
      alt: 'Trip Image 1',
    },
    {
      id: 2,
      src: 'https://via.placeholder.com/600x400?text=Image+2',
      alt: 'Trip Image 2',
    },
    {
      id: 3,
      src: 'https://via.placeholder.com/600x400?text=Image+3',
      alt: 'Trip Image 3',
    },
  ];

  return (
    <div className="trip-summary">
      <h1>Trip Summary</h1>
      
      {/* Tab Navigation */}
      <div className="tabs">
        <button
          className={activeTab === 'vlogs' ? 'active-tab' : ''}
          onClick={() => setActiveTab('vlogs')}
        >
          Vlogs
        </button>
        <button
          className={activeTab === 'gallery' ? 'active-tab' : ''}
          onClick={() => setActiveTab('gallery')}
        >
          Gallery
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'vlogs' && (
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
        )}

        {activeTab === 'gallery' && (
          <div className="gallery-section">
            <h2>Gallery</h2>
            <Carousel showThumbs={false} dynamicHeight>
              {galleryImages.map((image) => (
                <div key={image.id}>
                  <img src={image.src} alt={image.alt} />
                </div>
              ))}
            </Carousel>
          </div>
        )}
      </div>

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
          min-height: 300px; /* Ensure that tab content area has consistent height */
        }
      `}</style>
    </div>
  );
};

export default TripSummary;

