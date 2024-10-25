export interface SlideShowFrame {
    image: HTMLImageElement;
    duration: number;
  }
  
  export class VideoGenerator {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private mediaRecorder: MediaRecorder | null = null;
    private chunks: Blob[] = [];
    private frames: SlideShowFrame[] = [];
    private frameRate = 30;
    private transitionDuration = 1;
    private audioContext: AudioContext;
    private audioElement: HTMLAudioElement | null = null;
    private audioDestination: MediaStreamAudioDestinationNode | null = null;
    private readonly DEFAULT_AUDIO_PATH = '/assets/background-music.mp3'; // Update this path to your audio file location
  
    constructor(width: number = 1280, height: number = 720) {
      this.canvas = document.createElement('canvas');
      this.canvas.width = width;
      this.canvas.height = height;
      const ctx = this.canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      this.ctx = ctx;
      this.audioContext = new AudioContext();
      this.initializeAudio(); // Automatically set up audio when instance is created
    }
  
    private async initializeAudio() {
      try {
        // Create audio element
        this.audioElement = new Audio(this.DEFAULT_AUDIO_PATH);
        this.audioElement.loop = true;
  
        // Create audio source from element
        await this.audioElement.play();
        this.audioElement.pause();
        const source = this.audioContext.createMediaElementSource(this.audioElement);
        
        // Create destination for audio stream
        this.audioDestination = this.audioContext.createMediaStreamDestination();
        
        // Connect audio pipeline
        source.connect(this.audioDestination);
      } catch (error) {
        console.error('Failed to initialize audio:', error);
      }
    }
  
    private async loadImage(src: string): Promise<HTMLImageElement> {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    }
  
    private drawImageCovered(image: HTMLImageElement) {
      const { width: canvasWidth, height: canvasHeight } = this.canvas;
      
      const scale = Math.max(canvasWidth / image.width, canvasHeight / image.height);
      const scaledWidth = image.width * scale;
      const scaledHeight = image.height * scale;
      
      const x = (canvasWidth - scaledWidth) / 2;
      const y = (canvasHeight - scaledHeight) / 2;
      
      this.ctx.fillStyle = '#000000';
      this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      
      this.ctx.drawImage(image, x, y, scaledWidth, scaledHeight);
    }
  
    private drawTransition(fromImage: HTMLImageElement, toImage: HTMLImageElement, progress: number) {
      this.drawImageCovered(fromImage);
      this.ctx.globalAlpha = progress;
      this.drawImageCovered(toImage);
      this.ctx.globalAlpha = 1;
    }
  
    async prepareFrames(imageSources: string[], frameDuration: number = 3) {
      this.frames = [];
      for (const src of imageSources) {
        const image = await this.loadImage(src);
        this.frames.push({ image, duration: frameDuration });
      }
    }
  
    async generateVideo(onProgress?: (progress: number) => void): Promise<Blob> {
      if (this.frames.length === 0) {
        throw new Error('No frames prepared');
      }
  
      return new Promise((resolve, reject) => {
        try {
          const videoStream = this.canvas.captureStream(this.frameRate);
          
          // Combine video and audio streams if audio is present
          let combinedStream: MediaStream;
          if (this.audioDestination) {
            const audioStream = this.audioDestination.stream;
            const audioTracks = audioStream.getAudioTracks();
            combinedStream = new MediaStream([
              ...videoStream.getVideoTracks(),
              ...audioTracks
            ]);
          } else {
            combinedStream = videoStream;
          }
  
          this.mediaRecorder = new MediaRecorder(combinedStream, {
            mimeType: 'video/webm;codecs=vp9',
            videoBitsPerSecond: 5000000
          });
  
          this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              this.chunks.push(event.data);
            }
          };
  
          this.mediaRecorder.onstop = () => {
            const blob = new Blob(this.chunks, { type: 'video/webm' });
            this.chunks = [];
            if (this.audioElement) {
              this.audioElement.pause();
              this.audioElement.currentTime = 0;
            }
            resolve(blob);
          };
  
          let startTime = performance.now();
          let totalDuration = this.frames.reduce((sum, frame) => sum + frame.duration, 0);
  
          // Start audio playback if present
          if (this.audioElement) {
            this.audioElement.currentTime = 0;
            this.audioElement.play();
          }
  
          const animate = () => {
            const elapsed = (performance.now() - startTime) / 1000;
            
            if (elapsed >= totalDuration) {
              this.mediaRecorder?.stop();
              return;
            }
  
            let frameDurationSum = 0;
            let currentFrame = 0;
            
            for (let i = 0; i < this.frames.length; i++) {
              const nextDuration = frameDurationSum + this.frames[i].duration;
              if (elapsed < nextDuration) {
                currentFrame = i;
                const frameElapsed = elapsed - frameDurationSum;
                const frameDuration = this.frames[i].duration;
                
                if (frameElapsed > frameDuration - this.transitionDuration) {
                  const nextFrame = (i + 1) % this.frames.length;
                  const transitionProgress = (frameElapsed - (frameDuration - this.transitionDuration)) / this.transitionDuration;
                  this.drawTransition(
                    this.frames[i].image,
                    this.frames[nextFrame].image,
                    transitionProgress
                  );
                } else {
                  this.drawImageCovered(this.frames[i].image);
                }
                break;
              }
              frameDurationSum = nextDuration;
            }
  
            if (onProgress) {
              onProgress(Math.min(elapsed / totalDuration, 1));
            }
  
            requestAnimationFrame(animate);
          };
  
          this.mediaRecorder.start();
          animate();
        } catch (error) {
          reject(error);
        }
      });
    }
  
    dispose() {
      if (this.audioElement) {
        this.audioElement.pause();
        this.audioElement.remove();
      }
      if (this.audioContext.state !== 'closed') {
        this.audioContext.close();
      }
    }
}

// // videoGenerator.ts
// export interface SlideShowFrame {
//     image: HTMLImageElement;
//     duration: number;
//   }
  
//   export class VideoGenerator {
//     private canvas: HTMLCanvasElement;
//     private ctx: CanvasRenderingContext2D;
//     private mediaRecorder: MediaRecorder | null = null;
//     private chunks: Blob[] = [];
//     private frames: SlideShowFrame[] = [];
//     private frameRate = 30;
//     private transitionDuration = 1;
  
//     constructor(width: number = 1280, height: number = 720) {
//       this.canvas = document.createElement('canvas');
//       this.canvas.width = width;
//       this.canvas.height = height;
//       const ctx = this.canvas.getContext('2d');
//       if (!ctx) throw new Error('Could not get canvas context');
//       this.ctx = ctx;
//     }
  
//     private async loadImage(src: string): Promise<HTMLImageElement> {
//       return new Promise((resolve, reject) => {
//         const img = new Image();
//         img.onload = () => resolve(img);
//         img.onerror = reject;
//         img.src = src;
//       });
//     }
  
//     private drawImageCovered(image: HTMLImageElement) {
//       const { width: canvasWidth, height: canvasHeight } = this.canvas;
      
//       // Calculate dimensions to maintain aspect ratio and cover the canvas
//       const scale = Math.max(canvasWidth / image.width, canvasHeight / image.height);
//       const scaledWidth = image.width * scale;
//       const scaledHeight = image.height * scale;
      
//       // Center the image
//       const x = (canvasWidth - scaledWidth) / 2;
//       const y = (canvasHeight - scaledHeight) / 2;
      
//       // Clear the canvas before drawing
//       this.ctx.fillStyle = '#000000';
//       this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      
//       // Draw the image
//       this.ctx.drawImage(image, x, y, scaledWidth, scaledHeight);
//     }
  
//     private drawTransition(fromImage: HTMLImageElement, toImage: HTMLImageElement, progress: number) {
//       // Draw the first image
//       this.drawImageCovered(fromImage);
      
//       // Draw the second image with opacity
//       this.ctx.globalAlpha = progress;
//       this.drawImageCovered(toImage);
//       this.ctx.globalAlpha = 1;
//     }
  
//     async prepareFrames(imageSources: string[], frameDuration: number = 3) {
//       this.frames = [];
//       for (const src of imageSources) {
//         const image = await this.loadImage(src);
//         this.frames.push({ image, duration: frameDuration });
//       }
//     }
  
//     async generateVideo(onProgress?: (progress: number) => void): Promise<Blob> {
//       if (this.frames.length === 0) {
//         throw new Error('No frames prepared');
//       }
  
//       return new Promise((resolve, reject) => {
//         try {
//           const stream = this.canvas.captureStream(this.frameRate);
//           this.mediaRecorder = new MediaRecorder(stream, {
//             mimeType: 'video/webm;codecs=vp9',
//             videoBitsPerSecond: 5000000 // 5 Mbps
//           });
  
//           this.mediaRecorder.ondataavailable = (event) => {
//             if (event.data.size > 0) {
//               this.chunks.push(event.data);
//             }
//           };
  
//           this.mediaRecorder.onstop = () => {
//             const blob = new Blob(this.chunks, { type: 'video/webm' });
//             this.chunks = [];
//             resolve(blob);
//           };
  
//           let startTime = performance.now();
//           let totalDuration = this.frames.reduce((sum, frame) => sum + frame.duration, 0);
  
//           const animate = () => {
//             const elapsed = (performance.now() - startTime) / 1000;
            
//             if (elapsed >= totalDuration) {
//               this.mediaRecorder?.stop();
//               return;
//             }
  
//             // Find current frame
//             let frameDurationSum = 0;
//             let currentFrame = 0;
            
//             for (let i = 0; i < this.frames.length; i++) {
//               const nextDuration = frameDurationSum + this.frames[i].duration;
//               if (elapsed < nextDuration) {
//                 currentFrame = i;
//                 const frameElapsed = elapsed - frameDurationSum;
//                 const frameDuration = this.frames[i].duration;
                
//                 // Handle transition
//                 if (frameElapsed > frameDuration - this.transitionDuration) {
//                   const nextFrame = (i + 1) % this.frames.length;
//                   const transitionProgress = (frameElapsed - (frameDuration - this.transitionDuration)) / this.transitionDuration;
//                   this.drawTransition(
//                     this.frames[i].image,
//                     this.frames[nextFrame].image,
//                     transitionProgress
//                   );
//                 } else {
//                   this.drawImageCovered(this.frames[i].image);
//                 }
//                 break;
//               }
//               frameDurationSum = nextDuration;
//             }
  
//             if (onProgress) {
//               onProgress(Math.min(elapsed / totalDuration, 1));
//             }
  
//             requestAnimationFrame(animate);
//           };
  
//           this.mediaRecorder.start();
//           animate();
//         } catch (error) {
//           reject(error);
//         }
//       });
//     }
//   }