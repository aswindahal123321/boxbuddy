import { build } from "esbuild";
import { rmSync, mkdirSync } from "node:fs";

const handlers = ["signup", "login", "me", "createOrder", "listOrders"];

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist", { recursive: true });

await Promise.all(
  handlers.map((name) =>
    build({
      entryPoints: [`src/handlers/${name}.ts`],
      outfile: `dist/${name}/index.mjs`,
      bundle: true,
      platform: "node",
      format: "esm",
      target: "node20",
      sourcemap: false,
      external: [],
    })
  )
);

console.log("Bundled handlers:", handlers.join(", "));
