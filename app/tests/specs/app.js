define(["jquery", "backbone", "jasmine", "app"], function($, Backbone, jasmine, app) {
    jasmine.getFixtures().fixturesPath = 'app/tests/fixtures';

    describe("Moxie app changing views", function() {
        var el = $('<div></div>');
        beforeEach(function() {
            app.currentLayout = null;
        });

        it("Should call render on any new view", function() {
            var dummyView = jasmine.createSpyObj('view', ['render']);
            app.showView(dummyView, {el: el});
            expect(dummyView.render).toHaveBeenCalled();
        });

        it("Should fully remove a view", function() {
            var dummyView = jasmine.createSpyObj('view', ['render', 'remove']);
            var dummyView2 = jasmine.createSpyObj('view2', ['render']);
            app.showView(dummyView, {el: el});
            app.showView(dummyView2, {el: el});
            expect(dummyView.remove).toHaveBeenCalled();
            expect(dummyView2.render).toHaveBeenCalled();
        });
    });
});
