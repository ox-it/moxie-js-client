define(["jquery", "backbone", "jasmine", "core/collections/MoxieCollection"], function($, Backbone, jasmine, MoxieCollection) {
    describe("Accessing data asynchronously using the MoxieCollection", function() {
        it("Should call success if the model is already in that collection", function() {
            var collection  = new MoxieCollection([{id: 1, name: 'dave'}]);
            collection.getAsync(1, {success: function(m) {
                expect(m.get('name')).toBe('dave');
            }});
        });
        it("Should call success if the model is added in a pendingEvent", function() {
            var collection  = new MoxieCollection([]);
            var successCallback = jasmine.createSpy();
            collection.getAsync(1, {success: successCallback});
            collection.reset([{id: 1, name: 'foo'}]);
            expect(successCallback).toHaveBeenCalled();
        });
        it("Should call failure if the model isn't in that collection once the pendingEvent has fired", function() {
            var collection  = new MoxieCollection([]);
            var failureCallback = jasmine.createSpy();
            collection.getAsync(1, {failure: failureCallback});
            collection.reset([]);
            expect(failureCallback).toHaveBeenCalled();
        });
        it("Should call success if the model is added in a user-specified pendingEvent", function() {
            var collection  = new MoxieCollection([]);
            var successCallback = jasmine.createSpy();
            collection.getAsync(1, {success: successCallback, pendingEvent: 'add'});
            collection.add({id: 1, name: 'foo'});
            expect(successCallback).toHaveBeenCalled();
        });
    });
});
