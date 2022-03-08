import imageSplicer from "./image-splicer.mjs";

const images = await imageSplicer(
  "https://dummyimage.com/800x3000/000/fff.png"
);
console.log(images);
