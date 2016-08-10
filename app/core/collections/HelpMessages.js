define(['backbone', 'app/core/collections/LocalStorageCollection'], function(Backbone, LocalStorageCollection) {
    var HelpMessages = LocalStorageCollection.extend({
        name: "help-messages",
        model: Backbone.Model.extend({idAttribute: 'name'}),
        setSeen: function(name) {
            // The user has seen the help message
            this.create({name: name});
        },
        getSeen: function(name) {
            // Should the help message be shown to the user?
            var model = false;
            try {
                model = this.get(name);
            } catch (e) {
                if ('console' in window) {
                    console.log("Error accessing localStorage");
                    console.log(e);
                }
            }
            return Boolean(model);
        }
    });
    return HelpMessages;
});
