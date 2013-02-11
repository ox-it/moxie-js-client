require(["jquery", "backbone", "jasmine-html"],

  function($, Backbone, jasmine) {
    specs = [];
    specs.push('tests/specs/spec');
    $(function() {
      require(specs, function() {
        jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
        jasmine.getEnv().execute();
      });
    });
  }
);
