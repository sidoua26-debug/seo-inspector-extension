const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ffmpegPath = '/home/sid/.gemini/antigravity/scratch/auditpilot/backend/node_modules/ffmpeg-static/ffmpeg';
const outDir = path.resolve('store-assets');

const scene1 = path.join(outDir, 'scene-1-setup.jpg');
const scene2 = path.join(outDir, 'scene-2-gears.jpg');
const scene3 = path.join(outDir, 'scene-3-fluid.jpg');
const scene4 = path.join(outDir, 'scene-4-hud.jpg');

const mp4Out = path.join(outDir, 'antigravity-cinematic-demo.mp4');
const webmOut = path.join(outDir, 'antigravity-cinematic-demo.webm');

console.log('[generate-cinematic-video] Building 30-second cinematic sequence with FFmpeg...');

// Durations:
// Clip 1: 0 - 6s (fade out at 5-6s)
// Clip 2: 7s (fade in at 5s, fade out at 11s) -> offset 5
// Clip 3: 11s (fade in at 11s, fade out at 21s) -> offset 11
// Clip 4: 10s (fade in at 21s, ends at 30s) -> offset 21

const filterComplex = `
[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='min(zoom+0.0006,1.15)':d=180:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30,fps=30,trim=duration=6,setpts=PTS-STARTPTS[v0];
[1:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='min(zoom+0.0008,1.20)':d=210:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30,fps=30,trim=duration=7,setpts=PTS-STARTPTS[v1];
[2:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='min(zoom+0.0005,1.15)':d=330:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30,fps=30,trim=duration=11,setpts=PTS-STARTPTS[v2];
[3:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='if(lte(zoom,1.0),1.15,max(1.0,zoom-0.0008))':d=300:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30,fps=30,trim=duration=10,setpts=PTS-STARTPTS[v3];
[v0][v1]xfade=transition=fade:duration=1:offset=5[x0];
[x0][v2]xfade=transition=fade:duration=1:offset=11[x1];
[x1][v3]xfade=transition=fade:duration=1:offset=21[v];
anoisesrc=d=30:c=pink:r=48000:a=0.012,lowpass=f=120[noise];
sine=f=55:d=30:r=48000[subbass];
sine=f=110:d=30:r=48000[tone];
[subbass][tone]amix=inputs=2:weights=1 0.35[hum_base];
[hum_base][noise]amix=inputs=2:weights=0.8 0.25,afade=t=in:ss=0:d=3,afade=t=out:st=23:d=5[a]
`;

const cmdMp4 = `"${ffmpegPath}" -y \
  -loop 1 -t 6 -i "${scene1}" \
  -loop 1 -t 7 -i "${scene2}" \
  -loop 1 -t 11 -i "${scene3}" \
  -loop 1 -t 10 -i "${scene4}" \
  -filter_complex "${filterComplex.replace(/\n/g, '')}" \
  -map "[v]" -map "[a]" \
  -c:v libx264 -pix_fmt yuv420p -preset medium -crf 20 \
  -c:a aac -b:a 192k \
  -t 30 \
  "${mp4Out}"`;

console.log('[generate-cinematic-video] Encoding MP4...');
execSync(cmdMp4, { stdio: 'inherit' });

console.log('[generate-cinematic-video] Transcoding WebM...');
const cmdWebm = `"${ffmpegPath}" -y -i "${mp4Out}" -c:v libvpx-vp9 -b:v 2M -c:a libopus -b:a 128k "${webmOut}"`;
execSync(cmdWebm, { stdio: 'inherit' });

console.log('✅ [generate-cinematic-video] Successfully generated:');
console.log(`   MP4:  ${mp4Out} (${(fs.statSync(mp4Out).size / (1024 * 1024)).toFixed(2)} MB)`);
console.log(`   WebM: ${webmOut} (${(fs.statSync(webmOut).size / (1024 * 1024)).toFixed(2)} MB)`);
