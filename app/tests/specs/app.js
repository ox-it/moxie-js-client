define(["jquery", "backbone", "jasmine", "app"], function($, Backbone, jasmine, app) {
    jasmine.getFixtures().fixturesPath = 'app/tests/fixtures';

    describe("Moxie app changing views", function() {
        var el = $('<div></div>');
        beforeEach(function() {
            app.currentView = undefined;
            app.pageStack = 0;
        });

        it("Should call render on any new view", function() {
            var dummyView = jasmine.createSpyObj('view', ['render']);
            app.showView(dummyView, {el: el});
            expect(dummyView.render).toHaveBeenCalled();
        });

        it("Should fully remove a view", function() {
            var dummyView = jasmine.createSpyObj('view', ['render', 'remove', 'unbind']);
            var dummyView2 = jasmine.createSpyObj('view2', ['render']);
            app.showView(dummyView, {el: el});
            app.showView(dummyView2, {el: el});
            expect(dummyView.remove).toHaveBeenCalled();
            expect(dummyView.unbind).toHaveBeenCalled();
            expect(dummyView2.render).toHaveBeenCalled();
        });

        it("Should call onClose if defined", function() {
            var dummyView = jasmine.createSpyObj('view', ['render', 'remove', 'unbind', 'onClose']);
            var dummyView2 = jasmine.createSpyObj('view2', ['render']);
            app.showView(dummyView, {el: el});
            app.showView(dummyView2, {el: el});
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
            app.showView(dummyView, {el: el});
            expect(dummyView.render).toHaveBeenCalled();
            expect(jqHtml.mostRecentCall.object.selector).toNotEqual('#content');
        });

        it("Should call html function on jquery object", function() {
            var jqHtml = spyOn($.fn, "html");
            var dummyView = jasmine.createSpyObj('view', ['render']);
            app.showView(dummyView, {el: el});
            expect(dummyView.render).toHaveBeenCalled();
            expect(jqHtml).toHaveBeenCalled();
        });

        it("Should set the current view", function() {
            var dummyView = jasmine.createSpyObj('view', ['render']);
            app.showView(dummyView, {el: el});
            expect(app.currentView).toBe(dummyView);
        });
    });

    describe("Back/home button behaviour on typical navigation", function() {
        beforeEach(function() {
            app.currentView = undefined;
            app.pageStack = 5; // not 0 as it's not the initial page load
        });

        it("Should hide the back button by default", function() {
            loadFixtures('base.html');
            var testView = new Backbone.View();
            app.showView(testView);
            expect($("#back")).toBeHidden();
        });

        it("Should show the home button by default", function() {
            loadFixtures('base.html');
            var testView = new Backbone.View();
            app.showView(testView);
            expect($("#home")).not.toBeHidden();
        });

        it("Should show the back button when requested", function() {
            loadFixtures('base.html');
            var testView = new Backbone.View();
            app.showView(testView, {back: true});
            expect($("#back")).not.toBeHidden();
        });

        it("Should hide the home button when showing a back button", function() {
            loadFixtures('base.html');
            var testView = new Backbone.View();
            app.showView(testView, {back: true});
            expect($("#home")).toBeHidden();
        });
    });

    describe("Back/home button behaviour initial page load", function() {
        beforeEach(function() {
            app.currentView = undefined;
            app.pageStack = 0;
            spyOn(window.history, 'back');
        });

        it("Should increse the pageStack count by 1 each view shown", function() {
            loadFixtures('base.html');
            var testView = new Backbone.View();
            app.showView(testView);
            expect(app.pageStack).toBe(1);
            var testView2 = new Backbone.View();
            app.showView(testView);
            expect(app.pageStack).toBe(2);
        });

        it("Should reduce the pageStack count by 2 each time the user clicks back", function() {
            loadFixtures('base.html');
            var testView = new Backbone.View();
            app.showView(testView);
            expect(app.pageStack).toBe(1);
            var testView2 = new Backbone.View();
            app.showView(testView, {back: true});
            expect(app.pageStack).toBe(2);
            $('#back a').click();
            expect(app.pageStack).toBe(0);
        });

        it("Should call history.back when the user clicks back", function() {
            loadFixtures('base.html');
            var testView = new Backbone.View();
            app.showView(testView);
            var testView2 = new Backbone.View();
            app.showView(testView, {back: true});
            $('#back a').click();
            expect(window.history.back).toHaveBeenCalled();
        });
    });

});
