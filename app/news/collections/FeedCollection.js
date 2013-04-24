define(["backbone", "news/models/FeedModel"], function(Backbone, Feed) {

    var Feeds = Backbone.Collection.extend({
        model: Feed
    });

    return Feeds;

});
