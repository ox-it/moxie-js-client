define(["jquery", "backbone", "jasmine", "app"], function($, Backbone, jasmine, app) {

    describe("Moxie app changing views", function() {
        var el = $('<div></div>');

        afterEach(function() {
            app.currentView = undefined;
        });

        it("Should call render on any new view", function() {
            var dummyView = jasmine.createSpyObj('view', ['render']);
            app.showView(dummyView, el);
            expect(dummyView.render).toHaveBeenCalled();
        });

        it("Should fully remove a view", function() {
            var dummyView = jasmine.createSpyObj('view', ['render', 'remove', 'unbind']);
            var dummyView2 = jasmine.createSpyObj('view2', ['render']);
            app.showView(dummyView, el);
            app.showView(dummyView2, el);
            expect(dummyView.remove).toHaveBeenCalled();
            expect(dummyView.unbind).toHaveBeenCalled();
            expect(dummyView2.render).toHaveBeenCalled();
        });

        it("Should call onClose if defined", function() {
            var dummyView = jasmine.createSpyObj('view', ['render', 'remove', 'unbind', 'onClose']);
            var dummyView2 = jasmine.createSpyObj('view2', ['render']);
            app.showView(dummyView, el);
            app.showView(dummyView2, el);
            expect(dummyView.onClose).toHaveBeenCalled();
        });

        it("Should default to #content if no el supplied", function() {
            // This is a useful way to mock the html function out of the jquery prototype
            var jqHtml = spyOn($.fn, "html");
            var dummyView = jasmine.createSpyObj('view', ['render']);
            app.showView(dummyView);
            expect(dummyView.render).toHaveBeenCalled();
            // Here we inspect the object our Spy was called upon to
            // query the content of the jquery selector
            expect(jqHtml.mostRecentCall.object.selector).toEqual('#content');
        });

        it("Should not select content when overriding el", function() {
            var jqHtml = spyOn($.fn, "html");
            var dummyView = jasmine.createSpyObj('view', ['render']);
            app.showView(dummyView, el);
            expect(dummyView.render).toHaveBeenCalled();
            expect(jqHtml.mostRecentCall.object.selector).toNotEqual('#content');
        });


        it("Should call html function on jquery object", function() {
            var jqHtml = spyOn($.fn, "html");
            var dummyView = jasmine.createSpyObj('view', ['render']);
            app.showView(dummyView);
            expect(dummyView.render).toHaveBeenCalled();
            expect(jqHtml).toHaveBeenCalled();
        });
    });

});
