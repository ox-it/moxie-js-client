define(["backbone", "underscore", "moxie.conf", "news/collections/EntryCollection", "goog!feeds,1"], function(Backbone, _, conf, Entries) {

    var Feed = Backbone.Model.extend({
        initialize: function() {
            this.entries = new Entries();
            var feed = new google.feeds.Feed(this.get('url'));
            feed.setNumEntries(conf.news.numberOfEntries);
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
