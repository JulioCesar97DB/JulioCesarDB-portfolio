// Cuts Mona Sans down to what the home page sets: the characters below, and
// the slice of the weight and width axes the stylesheet reaches. The result
// is committed (src/assets/fonts) and declared in global.css over a
// unicode-range of exactly these characters, so any character outside it
// still falls through to Fontsource's full Latin file. Nothing can go
// missing; an unlisted character only costs the larger download.
//
// Run `npm run fonts` after upgrading @fontsource-variable/mona-sans, or
// when the copy starts using a character that is not listed here (and add
// it to the unicode-range in global.css too).
import { readFile, writeFile, mkdir } from "node:fs/promises";
import subsetFont from "subset-font";

const source = new URL(
  "../node_modules/@fontsource-variable/mona-sans/files/mona-sans-latin-standard-normal.woff2",
  import.meta.url,
);
const target = new URL("../src/assets/fonts/mona-sans-subset.woff2", import.meta.url);

// Basic Latin, then the accents Spanish needs and the punctuation in the copy.
const ascii = Array.from({ length: 0x7e - 0x20 + 1 }, (_, i) => String.fromCodePoint(0x20 + i)).join("");
const extra = " ©·¡¿ÁÉÍÑÓÚÜáéíñóúü–—‘’“”…";

const input = await readFile(source);
const output = await subsetFont(input, ascii + extra, {
  targetFormat: "woff2",
  variationAxes: {
    wght: { min: 400, max: 700 },
    wdth: { min: 100, max: 125 },
  },
});

await mkdir(new URL(".", target), { recursive: true });
await writeFile(target, output);

const kb = (n) => `${(n / 1000).toFixed(1)} KB`;
const ranges = [...new Set([...extra].map((c) => c.codePointAt(0)))]
  .sort((a, b) => a - b)
  .map((cp) => `U+${cp.toString(16).toUpperCase().padStart(4, "0")}`);
console.log(`mona-sans-subset.woff2: ${kb(input.length)} -> ${kb(output.length)}`);
console.log(`unicode-range: U+0020-007E,${ranges.join(",")}`);
