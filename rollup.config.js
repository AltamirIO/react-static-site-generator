import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import minify from 'rollup-plugin-babel-minify'
import typescript from 'rollup-plugin-typescript'
import pkg from './package.json'


const isProduction = process.env.NODE_ENV === 'production'

const plugins = [
  // First we lint our code to make sure it's formatted right.
  resolve({
    extensions: ['.ts', '.tsx'],
  }),
  // Next we compile our code so everyone understands it.
  babel(),
  typescript(),
  // Finally we make it tiny so it loads faster.
  isProduction
    ? minify({ comments: false })
    : null,
].filter(Boolean)


const external = Object.keys(pkg.dependencies || {})
  .concat(Object.keys(pkg.peerDependencies || {}))

export default [
  {
    input: 'src/siteGenerator.tsx',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
    external,
    plugins,
  },
]
