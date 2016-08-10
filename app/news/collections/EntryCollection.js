define(["app/core/collections/MoxieCollection", "app/news/models/EntryModel"], function(MoxieCollection, Entry) {

    var Entries = MoxieCollection.extend({
        model: Entry
    });

    return Entries;

});
