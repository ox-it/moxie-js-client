define(["jquery", "backbone", "jasmine", "favourites/views/FavouriteButtonView", "favourites/collections/Favourites", "app/moxie.conf", 'backbone.queryparams'], function($, Backbone, jasmine, FavouriteButtonView, Favourites, conf) {
    Backbone.history.start();

    describe("Behaviour of clicking the favourites button", function() {
        var el = $('<a></a>');
        var favourites = new Favourites();
        var button = new FavouriteButtonView({el: el, collection: favourites});

        afterEach(function() {
            button.collection.remove(button.collection.models);
        });

        it("Should set a class when clicked", function() {
            button.$el.click();
            expect(button.$el.hasClass('favourited')).toBe(true);
        });

        it("Should remove class when clicked twice", function() {
            button.$el.click();
            expect(button.$el.hasClass('favourited')).toBe(true);
            button.$el.click();
            expect(button.$el.hasClass('favourited')).toBe(false);
        });

        it("Should create a model in the Favourites collection when clicked", function() {
            expect(button.collection.toJSON().length).toBe(0);
            button.$el.click();
            expect(button.collection.toJSON().length).toBe(1);
        });

        it("Should remove the model from the Favourites collection when clicked twice", function() {
            expect(button.collection.toJSON().length).toBe(0);
            button.$el.click();
            expect(button.collection.toJSON().length).toBe(1);
            button.$el.click();
            expect(button.collection.toJSON().length).toBe(0);
        });
    });
    describe("Behaviour of clicking the favourites button", function() {

        var button;
        var pageTitle;
        beforeEach(function() {
            var el = $('<a></a>');
            var favourites = new Favourites();
            button = new FavouriteButtonView({el: el, collection: favourites});
            button.collection.remove(button.collection.models);
            pageTitle = document.title;
        });
        afterEach(function() {
            document.title = pageTitle;
        });
        it("Should set a sensible title for the favourite", function() {
            document.title = conf.titlePrefix + "Kaboom!";
            button.$el.click();
            expect(button.collection.first().get('title')).toBe("Kaboom!");
        });
        it("Should save the current hash with the favourite", function() {
            Backbone.history.navigate('foobar', {trigger:false});
            button.$el.click();
            expect(button.collection.first().get('fragment')).toBe("foobar");
            // leave this undefined as we don't start backbone.history for our tests
            Backbone.history.fragment = undefined;
        });
        it("Shouldn't save two favourites with different query string ordering", function() {
            Backbone.history.navigate('foo?bar=1&baz=2', {trigger:false});
            button.$el.click();
            Backbone.history.navigate('foo?baz=2&bar=1', {trigger:false});
            button.$el.click();
            expect(button.collection.toJSON().length).toBe(0);
            // leave this undefined as we don't start backbone.history for our tests
            Backbone.history.fragment = undefined;
        });
    });

});
