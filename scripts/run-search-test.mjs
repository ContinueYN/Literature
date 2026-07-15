import { build } from 'esbuild';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

await build({
  entryPoints: ['scripts/_searchtest.ts'],
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile: 'scripts/_searchtest.build.mjs'
});
await import(pathToFileURL(path.resolve('scripts/_searchtest.build.mjs')).href);
