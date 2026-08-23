const { createWorker } = require('tesseract.js');
const path = require('path');

const img1 = "C:/Users/SHAIK SALEEM/.gemini/antigravity/brain/5e3a9526-b6a8-48eb-a831-ab551dd91fa8/.user_uploaded/media_1787501820548.png";
const img2 = "C:/Users/SHAIK SALEEM/.gemini/antigravity/brain/5e3a9526-b6a8-48eb-a831-ab551dd91fa8/.user_uploaded/media_1787501904909.png";

async function testOCR(imgPath, label) {
  console.log(`\n================ Testing ${label} ================`);
  const worker = await createWorker('eng');
  const ret = await worker.recognize(imgPath);
  console.log("Recognized Raw Text:\n", ret.data.text);
  await worker.terminate();
}

async function run() {
  await testOCR(img1, "GitArcana Certificate");
  await testOCR(img2, "NPTEL Certificate");
}

run();
