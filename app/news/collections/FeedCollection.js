define(["core/collections/MoxieCollection", "news/models/FeedModel"], function(MoxieCollection, Feed) {

    var Feeds = MoxieCollection.extend({
        model: Feed
    });

    return Feeds;

});
