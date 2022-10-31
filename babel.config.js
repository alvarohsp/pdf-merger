module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          electron: '21',
        },
      },
    ],
    '@babel/preset-typescript',
    // [
    //   'minify',
    //   {
    //     mangle: {
    //       exclude: ['MyCustomError'],
    //     },
    //     keepFnName: false,
    //   },
    // ],
  ],
  ignore: ['**/*.spec.ts', '**/@types'],
};
