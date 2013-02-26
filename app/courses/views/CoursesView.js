define(['jquery', 'backbone', 'underscore', 'hbs!courses/templates/base_courses', 'hbs!courses/templates/courses', 'leaflet', 'moxie.conf'],
function($, Backbone, _, baseTemplate, coursesTemplate, L, MoxieConf){
    var CoursesView = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this);
        },

        attributes: {
            'class': 'generic'
        },

        render: function() {
            var context = {query: this.getQueryTitle(this.options.query)}
            this.$el.html(baseTemplate(context));
            $.ajax({
                url: MoxieConf.urlFor('courses_search') + "?q=" + this.options.query,
                dataType: 'json'
            }).success(this.renderCoursesList);
            Backbone.trigger('domchange:title', this.options.query);
        },

        renderCoursesList: function(data) {
            this.$("#loading").hide();
            var context = {courses: data._embedded};
            this.$("#results").html(coursesTemplate(context));
        },

        getQueryTitle: function(query) {
            // this code hides the Solr query syntax to replace it by a user-friendly definition
            var COURSE_SUBJECT_FIELD = 'course_subject';
            if (query.substring(0, COURSE_SUBJECT_FIELD.length) === COURSE_SUBJECT_FIELD) {
                return "Skill: " + query.substring(COURSE_SUBJECT_FIELD.length+1, query.length);
            } else {
                return "Search: " + query;
            }
        }
    });
    return CoursesView;
});
