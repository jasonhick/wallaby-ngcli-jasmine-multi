const wallabyWebpack = require('wallaby-webpack');
const path = require('path');

const compilerOptions = Object.assign(
  require('./tsconfig.json').compilerOptions,
  require('./projects/test-app/tsconfig.spec.json').compilerOptions);

compilerOptions.module = 'CommonJs';

module.exports = function (wallaby) {


  const webpackPostprocessor = wallabyWebpack({
    entryPatterns: [
      'projects/test-app/src/wallabyTest.js',
      'projects/test-app/src/**/*spec.js',
      'projects/test-lib/src/**/*spec.js'
    ],

    module: {
      rules: [
        {test: /\.css$/, loader: ['raw-loader']},
        {test: /\.html$/, loader: 'raw-loader'},
        {test: /\.ts$/, loader: '@ngtools/webpack', include: /node_modules/, query: {tsConfigPath: 'tsconfig.json'}},
        {test: /\.js$/, loader: 'angular2-template-loader', exclude: /node_modules/},
        {test: /\.styl$/, loaders: ['raw-loader', 'stylus-loader']},
        {test: /\.less$/, loaders: ['raw-loader', {loader: 'less-loader', options: {paths: [__dirname]}}]},
        {test: /\.scss$|\.sass$/, loaders: ['raw-loader', 'sass-loader']},
        {test: /\.(jpg|png|svg)$/, loader: 'raw-loader'}
      ]
    },

    resolve: {
      extensions: ['.js', '.ts'],
      modules: [
        path.join(wallaby.projectCacheDir, 'projects/test-app/src/app'),
        path.join(wallaby.projectCacheDir, 'projects/test-app/src'),
        path.join(wallaby.projectCacheDir, 'projects/test-lib/src/app'),
        path.join(wallaby.projectCacheDir, 'projects/test-lib/src'),
        'node_modules'
      ]
    },
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      dns: 'empty'
    }
  });

  return {
    files: [
      {pattern: 'projects/test-app/src/**/*.+(ts|css|less|scss|sass|styl|html|json|svg)', load: false},
      {pattern: 'projects/test-app/src/**/*.d.ts', ignore: true},
      {pattern: 'projects/test-app/src/**/*spec.ts', ignore: true},
      {pattern: 'projects/test-lib/src/**/*.+(ts|css|less|scss|sass|styl|html|json|svg)', load: false},
      {pattern: 'projects/test-lib/src/**/*.d.ts', ignore: true},
      {pattern: 'projects/test-lib/src/**/*spec.ts', ignore: true}
    ],

    tests: [
      {pattern: 'projects/test-app/src/**/*spec.ts', load: false},
      {pattern: 'projects/test-app/src/**/*e2e-spec.ts', ignore: true},
      {pattern: 'projects/test-lib/src/**/*spec.ts', load: false},
      {pattern: 'projects/test-lib/src/**/*e2e-spec.ts', ignore: true}
    ],

    testFramework: 'jasmine',

    compilers: {
      '**/*.ts': wallaby.compilers.typeScript(compilerOptions)
    },

    middleware: function (app, express) {
      var path = require('path');
      app.use('/favicon.ico', express.static(path.join(__dirname, 'projects/test-app/src/src/favicon.ico')));
      app.use('/assets', express.static(path.join(__dirname, 'projects/test-app/src/src/assets')));
    },

    env: {
      kind: 'chrome'
    },

    postprocessor: webpackPostprocessor,

    setup: function () {
      window.__moduleBundler.loadTests();
    },

    debug: true
  };
};
