define(["underscore", "app/core/collections/MoxieCollection", "app/courses/models/CourseModel", "app/moxie.conf"], function(_, MoxieCollection, Course, conf) {

    var courses = MoxieCollection.extend({
        model: Course,
        url: function() {
            return conf.urlFor('courses_search') + "?q=" + this.query;
        },
        fetch: function() {
            this.ongoingFetch = true;
            MoxieCollection.prototype.fetch.apply(this);
        },
        parse: function(data) {
            this.ongoingFetch = false;
            if (data._embedded && data._embedded.courses) {
                return data._embedded.courses;
            } else {
                return {};
            }
        },

    });

    return courses;
});
