// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as esBuild from 'esbuild'

esBuild.buildSync({
  entryPoints: ['server.ts'],
  bundle: true,
  platform: 'node',
  external: ['./node_modules/*'],
  outfile: 'out.js',
  format: 'esm',
})
