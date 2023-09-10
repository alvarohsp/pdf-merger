module.exports = {
  generatorOpts: {
    minified: true,
  },
  // plugins: [
  //   [
  //     'babel-plugin-transform-builtin-classes',
  //     {
  //       globals: ['Array', 'Error', 'HTMLElement'],
  //     },
  //   ],
  // ],
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          electron: '21',
        },
        modules: 'commonjs',
      },
    ],
    ['@babel/preset-typescript'],
  ],
  ignore: ['**/*.spec.ts', '**/@types'],
};
