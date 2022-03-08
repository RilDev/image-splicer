import sharp from "sharp";
import fetch from "node-fetch";

export default async function (imageUrl) {
  const imageName = imageUrl.split("/").pop().replace(".", "-");
  const extenssion = "webp";
  const imagePath = `images/${imageName}.${extenssion}`;
  const image = await fetch(imageUrl);
  const imageBuffer = await image.buffer();
  const imageSharp = await sharp(imageBuffer);
  const imageMetadata = await imageSharp.metadata();
  const createdImages = [];

  // split image into shorter images & save them
  const spliceHeight = 1200;
  const imageHeight = imageMetadata.height;
  const spliceCount = Math.ceil(imageHeight / spliceHeight);

  if (spliceCount > 1) {
    for (let i = 0; i < spliceCount; i++) {
      const currentImagePath = `${imagePath.split(".")[0]}-${i}.${extenssion}`;
      let currentSpliceHeight = spliceHeight;
      const totalSpliceHeight = currentSpliceHeight * (i + 1);

      if (totalSpliceHeight > imageHeight) {
        currentSpliceHeight = totalSpliceHeight - imageHeight;
      }

      await imageSharp
        .extract({
          top: spliceHeight * i,
          height: currentSpliceHeight,
          left: 0,
          width: imageMetadata.width,
        })
        .toFile(currentImagePath);

      createdImages.push(currentImagePath);
    }
  } else {
    await imageSharp.toFile(imagePath);
    createdImages.push(imagePath);
  }

  return createdImages;
}
