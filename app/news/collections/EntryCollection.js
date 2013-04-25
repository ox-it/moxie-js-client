define(["backbone", "news/models/EntryModel"], function(Backbone, Entry) {

    var Entries = Backbone.Collection.extend({
        model: Entry
    });

    return Entries;

});
