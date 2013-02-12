require(["jquery", "backbone", "jasmine-html"],

  function($, Backbone, jasmine) {
    specs = [];
    specs.push('tests/specs/app');
    $(function() {
      require(specs, function() {
        jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
        jasmine.getEnv().execute();
      });
    });
  }
);
