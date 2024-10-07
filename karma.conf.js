// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    random: false,
    singleRun: false,
    basePath: "",
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-jasmine-html-reporter"),
      require("karma-coverage"),
      require("@angular-devkit/build-angular/plugins/karma"),
    ],
    client: {
      jasmine: {
        random: true,
        seed: 4321,
        stopOnFailure: true,
        failFast: true,
        timeOutInterval: 1000,
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with `random: false`
        // or set a specific seed with `seed: 4321`
      },
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true, // removes the duplicated traces
    },
    // port: 9876,
    coverageReporter: {
      dir: require("path").join(__dirname, "./coverage/repaso-tour-of-heroes"),
      subdir: ".",
      reporters: [{ type: "html" }, { type: "text-summary" }],
    },
    reporters: ["progress", "kjhtml"],
    browsers: ["ChromeHeadless"],
    restartOnFileChange: true,
    // customLaunchers: {
    //   ChromeDebugging: {
    //     base: "Chrome",
    //     flags: ["--remote-debugging-port=9222"],
    //   },
    // },
    autoWatch: true,
  });
};
