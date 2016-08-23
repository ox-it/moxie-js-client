require(["jquery", "backbone", "jasmine-html", "jasmine-jquery"],

  function($, Backbone, jasmine) {
    // NOTE: This is *the* place to add specs to the test suite
    // See the docs for more info on adding specs to Moxie
    var baseRequirements = ['backbone.layoutmanager'];
    var specs = [];
    // Core app
    specs.push('app/tests/specs/app');
    // Today
    specs.push('app/today/specs/cards');
    // Places
    specs.push('app/places/specs/categories');
    // Favourites
    specs.push('app/favourites/specs/button');
    // Core
    specs.push('app/core/specs/infinite');
    specs.push('app/core/specs/collections');
    var requirements = baseRequirements.concat(specs);
    $(function() {
      require(requirements, function() {
        jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
        jasmine.getEnv().execute();
      });
    });
  }
);
