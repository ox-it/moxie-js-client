define(["underscore", "core/collections/MoxieCollection", "moxie.conf"], function(_, MoxieCollection, conf) {

    var Subjects = MoxieCollection.extend({
        url: conf.urlFor('courses_subjects'),

        fetch: function() {
            // If we're already retrieving subjects or we already have them then return
            if (this.ongoingFetch || this.length) { return; }
            this.ongoingFetch = true;
            MoxieCollection.prototype.fetch.apply(this);
        },
        parse: function(data) {
            this.ongoingFetch = false;
            return data._links['courses:subject'];
        },

    });

    return Subjects;
});
