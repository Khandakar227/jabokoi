import { Sequence, Img, Composition, useCurrentFrame } from "remotion";


export const MyVideo = ({ images, subtitles }: { images: string[], subtitles:{
    text: string;
    startFrame: number;
}[] }) => {
  return (
    <Composition
      id="MySlideshow"
      component={() => <MySlideshow images={images} subtitles={subtitles}/>}
      durationInFrames={500}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};

const durationPerImage = 200; // Display each image for 30 frames

export const MySlideshow = ({ images, subtitles }: { images: string[], subtitles:{
    text: string;
    startFrame: number;
}[] }) => {
  const frame = useCurrentFrame();

  // Find the subtitle that should be shown at the current frame
  const currentSubtitle = subtitles.find((subtitle, index) => {
    const nextSubtitle = subtitles[index + 1];
    return (
      frame >= subtitle.startFrame &&
      (!nextSubtitle || frame < nextSubtitle.startFrame)
    );
  });

  return (
    <>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {images.map((src, index) => (
          <Sequence
            key={index}
            from={index * durationPerImage}
            durationInFrames={durationPerImage}
          >
            <Img src={src} style={{ width: "100%", height: "100%" }} />
          </Sequence>
        ))}
        {currentSubtitle && (
          <div
            style={{
              position: "absolute",
              bottom: 50,
              width: "100%",
              textAlign: "center",
              color: "white",
              fontSize: "16px",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              padding: "10px",
            }}
          >
            {currentSubtitle.text}
          </div>
        )}
      </div>
    </>
  );
};
