require(["jquery", "backbone", "jasmine-html", "jasmine-jquery"],

  function($, Backbone, jasmine) {
    // NOTE: This is *the* place to add specs to the test suite
    // See the docs for more info on adding specs to Moxie
    var baseRequirements = ['backbone.layoutmanager'];
    var specs = [];
    // Core app
    specs.push('tests/specs/app');
    // Today
    specs.push('today/specs/cards');
    // Places
    specs.push('places/specs/categories');
    // Favourites
    specs.push('favourites/specs/button');
    // Core
    specs.push('core/specs/infinite');
    specs.push('core/specs/collections');
    var requirements = baseRequirements.concat(specs);
    $(function() {
      require(requirements, function() {
        jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
        jasmine.getEnv().execute();
      });
    });
  }
);
