import { readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const PUBLIC = path.join(ROOT, "public");

/** @type {Record<string, { maxWidth: number; quality: number }>} */
const OVERRIDES = {
  "content/bli/image_4.jpeg": { maxWidth: 1010, quality: 82 },
  "content/bli/image_5.jpeg": { maxWidth: 426, quality: 82 },
  "content/gitgud/logo.png": { maxWidth: 522, quality: 85 },
  "telkom-university.png": { maxWidth: 64, quality: 85 },
  "apple-developer-academy.png": { maxWidth: 310, quality: 85 },
};

const DEFAULT_SCREENSHOT = { maxWidth: 1228, quality: 82 };
const DEFAULT_LOGO = { maxWidth: 522, quality: 85 };

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KiB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MiB`;
}

function getConfig(relativePath) {
  if (OVERRIDES[relativePath]) return OVERRIDES[relativePath];
  if (relativePath.includes("/image_")) return DEFAULT_SCREENSHOT;
  if (relativePath.endsWith("logo.png")) return DEFAULT_LOGO;
  return DEFAULT_SCREENSHOT;
}

async function collectInputs() {
  /** @type {string[]} */
  const inputs = [];

  for (const dir of ["content/bli", "content/kochai", "content/gitgud"]) {
    const absDir = path.join(PUBLIC, dir);
    const entries = await readdir(absDir);
    for (const entry of entries) {
      if (/\.(png|jpe?g)$/i.test(entry)) {
        inputs.push(path.join(dir, entry));
      }
    }
  }

  for (const file of ["telkom-university.png", "apple-developer-academy.png"]) {
    inputs.push(file);
  }

  return inputs.sort();
}

async function optimizeOne(relativePath) {
  const inputPath = path.join(PUBLIC, relativePath);
  const outputPath = inputPath.replace(/\.(png|jpe?g)$/i, ".webp");
  const { maxWidth, quality } = getConfig(relativePath);

  const inputStat = await stat(inputPath);
  const image = sharp(inputPath);
  const metadata = await image.metadata();

  await image
    .resize({
      width: maxWidth,
      withoutEnlargement: true,
      fit: "inside",
    })
    .webp({ quality, effort: 4 })
    .toFile(outputPath);

  const outputStat = await stat(outputPath);
  const saved = inputStat.size - outputStat.size;

  console.log(
    `${relativePath} → ${path.basename(outputPath)} | ${metadata.width}x${metadata.height} → max ${maxWidth}w | ${formatBytes(inputStat.size)} → ${formatBytes(outputStat.size)} (saved ${formatBytes(saved)})`,
  );

  await unlink(inputPath);

  return { inputBytes: inputStat.size, outputBytes: outputStat.size };
}

async function main() {
  const inputs = await collectInputs();
  let totalIn = 0;
  let totalOut = 0;

  for (const relativePath of inputs) {
    const { inputBytes, outputBytes } = await optimizeOne(relativePath);
    totalIn += inputBytes;
    totalOut += outputBytes;
  }

  console.log(`\nOptimized ${inputs.length} files`);
  console.log(`Total: ${formatBytes(totalIn)} → ${formatBytes(totalOut)} (saved ${formatBytes(totalIn - totalOut)})`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
