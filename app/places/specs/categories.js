define(["jquery", "backbone", "jasmine", "places/collections/CategoryCollection"], function($, Backbone, jasmine, Categories) {
    describe("Parsing categories JSON representation", function() {
        var categories = {type: 'foo', types: [{type: 'bar', types: [{type: 'baz'}]}]};
        it("Should be flattened", function() {
            var collection = new Categories();
            collection.reset(categories, {parse: true});
            expect(collection.length).toEqual(3);
        });
        it("Should set a depth attribute", function() {
            var collection = new Categories();
            collection.reset(categories, {parse: true});
            expect(collection.find(function(m) { return m.get('type') === 'baz';}).get('depth')).toEqual(3);
        });
        it("Should set a depth attribute of 1 for top level types", function() {
            var collection = new Categories();
            collection.reset(categories, {parse: true});
            expect(collection.find(function(m) { return m.get('type') === 'foo';}).get('depth')).toEqual(1);
        });
        it("Should set an attribute hasTypes when there are subcategories", function() {
            var collection = new Categories();
            collection.reset(categories, {parse: true});
            expect(collection.find(function(m) { return m.get('type') === 'bar';}).get('hasTypes')).toBe(true);
        });
        it("Should not set hasTypes when there are no subcategories", function() {
            var collection = new Categories();
            collection.reset(categories, {parse: true});
            expect(collection.find(function(m) { return m.get('type') === 'baz';}).get('hasTypes')).toBe(undefined);
        });
    });
});
