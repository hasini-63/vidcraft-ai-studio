const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const inputImage = path.resolve(__dirname, '../client/public/assets/background-girl.jpg');
const outputVideo = path.resolve(__dirname, '../client/public/assets/background-girl.mp4');

console.log('Using FFmpeg at:', ffmpegPath);
console.log('Input Image:', inputImage);
console.log('Output Video:', outputVideo);

if (!fs.existsSync(inputImage)) {
  console.error('Input image does not exist:', inputImage);
  process.exit(1);
}

// 12-second seamless mathematical breathing cycle at 30fps = 360 frames
const duration = 12;
const fps = 30;
const totalFrames = duration * fps;

// zoompan with x centered toward right (0.85) where character is, slow sinusoidal float & gentle lighting pulse
const filter = [
  `zoompan=z='1.0+0.025*sin(2*PI*on/${totalFrames})':x='iw*(0.85-0.85/zoom)':y='ih*(0.35-0.35/zoom)':d=${totalFrames}:s=1920x1080:fps=${fps}`,
  `eq=brightness='0.015*sin(2*PI*t/${duration})':contrast=1.03:saturation=1.04`
].join(',');

const cmd = `"${ffmpegPath}" -y -loop 1 -i "${inputImage}" -vf "${filter}" -frames:v ${totalFrames} -c:v libx264 -pix_fmt yuv420p -profile:v high -preset medium -crf 22 -movflags +faststart "${outputVideo}"`;

console.log('Running FFmpeg rendering command...');
execSync(cmd, { stdio: 'inherit' });

console.log('✅ Background video successfully generated at:', outputVideo);
const stats = fs.statSync(outputVideo);
console.log(`Video File Size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
