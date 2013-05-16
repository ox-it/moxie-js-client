define(["underscore", "core/collections/MoxieCollection", "courses/models/CourseModel", "moxie.conf"], function(_, MoxieCollection, course, conf) {

    var courses = MoxieCollection.extend({
        model: course,
        url: function() {
            if (this.query) {
                return conf.urlFor('courses_search') + "?q=" + this.query;
            } else {
                return conf.urlFor('courses_subjects');
            }
        },
        fetch: function(query) {
            if (this.ongoingFetch && (this.query===query)) { return; }
            this.query = query;
            this.ongoingFetch = true;
            MoxieCollection.prototype.fetch.apply(this);
        },
        parse: function(data) {
            console.log(data);
            this.ongoingFetch = false;
            this.subjects = data._links['courses:subject'];
            if (data._embedded && data._embedded.courses) {
                return data._embedded.courses;
            } else {
                return {};
            }
        },

    });

    return courses;
});
