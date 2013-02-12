define(["jquery", "backbone", "jasmine", "app"], function($, Backbone, jasmine, app) {

    describe("Moxie app changing views", function() {

        beforeEach(function() {
            $(document).append('<div id="content"></div>');
        });

        afterEach(function() {
            $('#content').remove();
            app.currentView = undefined;
        });

        it("Should call render on any new view", function() {
            var dummyView = jasmine.createSpyObj('view', ['render']);
            app.showView(dummyView);
            expect(dummyView.render).toHaveBeenCalled();
        });

        it("Should fully remove a view", function() {
            var dummyView = jasmine.createSpyObj('view', ['render', 'remove', 'unbind']);
            var dummyView2 = jasmine.createSpyObj('view2', ['render']);
            app.showView(dummyView);
            app.showView(dummyView2);
            expect(dummyView.remove).toHaveBeenCalled();
            expect(dummyView.unbind).toHaveBeenCalled();
            expect(dummyView2.render).toHaveBeenCalled();
        });

        it("Should call onClose if defined", function() {
            var dummyView = jasmine.createSpyObj('view', ['render', 'remove', 'unbind', 'onClose']);
            var dummyView2 = jasmine.createSpyObj('view2', ['render']);
            app.showView(dummyView);
            app.showView(dummyView2);
            expect(dummyView.onClose).toHaveBeenCalled();
        });

    });

});
