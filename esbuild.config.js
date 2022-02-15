// eslint-disable-next-line @typescript-eslint/no-var-requires
require('esbuild').buildSync({
  entryPoints: ['src/server.ts'],
  bundle: true,
  platform: 'node',
  external: ['./node_modules/*'],
  outfile: 'out.js',
})