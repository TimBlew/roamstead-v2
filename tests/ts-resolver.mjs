import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const srcRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src");

function withTypeScriptExtension(file) {
  if (fs.existsSync(file)) return file;
  if (fs.existsSync(`${file}.ts`)) return `${file}.ts`;
  if (fs.existsSync(`${file}.tsx`)) return `${file}.tsx`;
  return file;
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const file = withTypeScriptExtension(path.join(srcRoot, specifier.slice(2)));
    return nextResolve(pathToFileURL(file).href, context);
  }
  return nextResolve(specifier, context);
}
