define(["underscore", "core/collections/MoxieCollection", "courses/models/CourseModel", "moxie.conf"], function(_, MoxieCollection, course, conf) {

    var courses = MoxieCollection.extend({
        model: course,
        url: conf.urlFor('courses_subjects'),
        fetch: function() {
            if (this.ongoingFetch || this.length > 0) { return; }
            this.ongoingFetch = true;
            MoxieCollection.prototype.fetch.apply(this, arguments);
        },
        parse: function(data) {
            this.ongoingFetch = false;
            this.subjects = data._links['courses:subject'];
            return _.omit(data, '_links');
        },

    });

    return courses;
});
