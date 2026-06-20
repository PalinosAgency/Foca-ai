import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const watermark = "desenvolvido por Arthur Miquelito Lopes e Heitor Crespo de Souza";
const legalLine = "Copyright (c) 2026 Arthur Miquelito Lopes e Heitor Crespo de Souza. Todos os direitos reservados.";

const ignoredDirs = new Set([
  ".git",
  ".vercel",
  "node_modules",
  "dist",
  "coverage",
]);

const ignoredFiles = new Set([
  "deploy_clean.txt",
  "deploy_logs.txt",
  "lint_output.txt",
  "lint_output_2.txt",
  "package-lock.json",
]);

const ignoredPathParts = [
  ["testsprite_tests", "tmp"],
];

const commentByExtension = new Map([
  [".js", blockComment],
  [".jsx", blockComment],
  [".mjs", blockComment],
  [".cjs", blockComment],
  [".ts", blockComment],
  [".tsx", blockComment],
  [".css", blockComment],
  [".html", htmlComment],
  [".md", htmlComment],
  [".py", hashComment],
  [".env.example", hashComment],
]);

function blockComment() {
  return `/*! ${watermark}
 * ${legalLine}
 * Aviso de propriedade intelectual: remocao ou alteracao deste aviso nao remove os direitos autorais dos autores.
 */`;
}

function htmlComment() {
  return `<!-- ${watermark}
${legalLine}
Aviso de propriedade intelectual: remocao ou alteracao deste aviso nao remove os direitos autorais dos autores.
-->`;
}

function hashComment() {
  return `# ${watermark}
# ${legalLine}
# Aviso de propriedade intelectual: remocao ou alteracao deste aviso nao remove os direitos autorais dos autores.`;
}

function commentFor(filePath) {
  const basename = path.basename(filePath);
  if (commentByExtension.has(basename)) return commentByExtension.get(basename)();

  const extension = path.extname(filePath);
  return commentByExtension.get(extension)?.();
}

function shouldSkip(filePath) {
  const relative = path.relative(root, filePath);
  if (!relative || relative.startsWith("..")) return true;

  const parts = relative.split(path.sep);
  if (parts.some((part) => ignoredDirs.has(part))) return true;
  if (ignoredPathParts.some((ignored) => ignored.every((part, index) => parts[index] === part))) return true;
  if (ignoredFiles.has(path.basename(filePath))) return true;

  return !commentFor(filePath);
}

function insertAfterShebang(source, comment) {
  if (!source.startsWith("#!")) return `${comment}\n${source}`;

  const firstLineEnd = source.indexOf("\n");
  if (firstLineEnd === -1) return `${source}\n${comment}\n`;

  return `${source.slice(0, firstLineEnd + 1)}${comment}\n${source.slice(firstLineEnd + 1)}`;
}

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) files.push(...await collectFiles(fullPath));
      continue;
    }

    if (entry.isFile() && !shouldSkip(fullPath)) files.push(fullPath);
  }

  return files;
}

async function run() {
  const mode = process.argv.includes("--check") ? "check" : "write";
  const files = await collectFiles(root);
  const missing = [];
  let updated = 0;

  for (const file of files) {
    const source = await readFile(file, "utf8");
    if (source.includes(watermark)) continue;

    if (mode === "check") {
      missing.push(path.relative(root, file));
      continue;
    }

    await writeFile(file, insertAfterShebang(source, commentFor(file)), "utf8");
    updated += 1;
  }

  if (missing.length > 0) {
    console.error("Arquivos sem marca d'agua de autoria:");
    for (const file of missing) console.error(`- ${file}`);
    console.error("\nExecute: npm run watermark");
    process.exit(1);
  }

  if (mode === "write") {
    console.log(`Marca d'agua aplicada em ${updated} arquivo(s).`);
  } else {
    console.log(`Marca d'agua verificada em ${files.length} arquivo(s).`);
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
