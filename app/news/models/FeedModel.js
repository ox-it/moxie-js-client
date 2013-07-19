define(["MoxieModel", "underscore", "moxie.conf", "news/collections/EntryCollection"], function(MoxieModel, _, conf, Entries) {

    var Feed = MoxieModel.extend({
        initialize: function() {
            this.entries = new Entries();
        },
        load: function() {
            var feed = new google.feeds.Feed(this.get('url'));
            feed.setNumEntries(conf.news.numberOfEntries);
            feed.load(_.bind(this.loaded, this));
        },
        loaded: function(result) {
            // TODO: Log errors here? Perhaps using Raven.js
            if (!result.error) {
                this.entries.reset(result.feed.entries, {parse: true});
            }
        },
        idAttribute: "slug"
    });
    return Feed;

});
