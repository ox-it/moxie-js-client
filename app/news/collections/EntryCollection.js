define(["core/collections/MoxieCollection", "news/models/EntryModel"], function(MoxieCollection, Entry) {

    var Entries = MoxieCollection.extend({
        model: Entry
    });

    return Entries;

});
