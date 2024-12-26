import sharp from "sharp";

import fs from "fs";
import path from "path";

function loadImage(imagePath: string): Buffer {
  const filePath = path.join(process.cwd(), imagePath);
  const imageBuffer = fs.readFileSync(filePath);
  return imageBuffer;
}

export async function GET() {
  const inputImage = loadImage("./test-2.png");

  const newImageBuffer = await sharp(inputImage)
    .rotate() // Auto-rotate based on EXIF orientation
    .removeAlpha()
    .resize({
      width: 1000, // 1000px should be enough. but 1500px would work for all cases.
      height: 1000,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({
      quality: 50, // Balanced quality
      progressive: false, // So not use progressive scan (make file size bigger)
      chromaSubsampling: "4:2:0", // Reduce chrominance resolution
      trellisQuantisation: true, // Enable trellis quantisation for better compression
      overshootDeringing: true, // Reduce ringing artifacts
      optimiseScans: true, // Optimize progressive scans
      optimiseCoding: true, // Optimize Huffman coding tables
      mozjpeg: true, // Use mozjpeg for better compression
    })
    .toBuffer();

  console.log("Image processing completed", newImageBuffer.length);

  return Response.json({ message: "Image processing started" });
}
