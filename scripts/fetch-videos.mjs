// Baixa os loops cinematográficos para public/videos antes do build.
// Nunca derruba o build: se um download falhar, o site usa a foto oficial.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const list = JSON.parse(readFileSync(join(root, "data/videos.json"), "utf8"));
const outDir = join(root, "public/videos");
mkdirSync(outDir, { recursive: true });

for (const [id, url] of Object.entries(list)) {
  if (id.startsWith("_") || typeof url !== "string" || !url.startsWith("https://")) continue;
  const dest = join(outDir, `${id}.mp4`);
  if (existsSync(dest)) {
    console.log(`[videos] ${id}: já existe, mantido`);
    continue;
  }
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(60_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 50_000) throw new Error("arquivo pequeno demais");
    writeFileSync(dest, buf);
    console.log(`[videos] ${id}: ${(buf.length / 1024 / 1024).toFixed(1)} MB`);
  } catch (e) {
    console.warn(`[videos] ${id}: não baixado (${e.message}) — usando a foto oficial`);
  }
}
