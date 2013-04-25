define(["backbone", "underscore", "news/collections/EntryCollection", "goog!feeds,1"], function(Backbone, _, Entries) {

    var Feed = Backbone.Model.extend({
        initialize: function() {
            this.entries = new Entries();
            var feed = new google.feeds.Feed(this.get('url'));
            feed.setNumEntries(10);
            feed.load(_.bind(this.loaded, this));
        },
        loaded: function(result) {
            if (!result.error) {
                this.entries.reset(result.feed.entries, {parse: true});
            } else {
                console.log("Failed to load RSS Feed");
            }
        },
        idAttribute: "slug"
    });
    return Feed;

});
