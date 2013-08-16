define(["backbone"], function(Backbone) {
    var LocalStorageCollection = Backbone.Collection.extend({
        initialize: function() {
            try {
                // Possible error thrown when loading without localStorage available
                this.localStorage = new Backbone.LocalStorage(this.name);
                this.fetch();
            } catch (e) {
                if ('console' in window) {
                    console.log("Error accessing localStorage");
                    console.log(e);
                }
            }
        },
        fetch: function() {
            if ('localStorage' in this) {
                Backbone.Collection.prototype.fetch.apply(this, arguments);
            }
            return this;
        }
    });
    return LocalStorageCollection;
});
