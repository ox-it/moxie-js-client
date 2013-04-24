define(["backbone", "underscore", "goog!feeds,1"], function(Backbone, _) {

    var Feed = Backbone.Model.extend({
        initialize: function() {
            var feed = new google.feeds.Feed(this.get('url'));
            feed.setNumEntries(10);
            feed.load(_.bind(this.loaded, this));
        },
        loaded: function(result) {
            if (!result.error) {
                console.log(result.feed.entries);
                this.set({entries: result.feed.entries});
            } else {
                console.log("Failed to load RSS Feed");
            }
        },
        idAttribute: "slug"
    });
    return Feed;

});
