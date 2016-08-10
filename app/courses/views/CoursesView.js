define(['jquery', 'backbone', 'underscore', 'hbs!app/courses/templates/courses', 'leaflet', 'app/moxie.conf'],
function($, Backbone, _, coursesTemplate, L, MoxieConf){
    var CoursesView = Backbone.View.extend({

        initialize: function() {
            this.collection.on('reset', this.render, this);
        },

        attributes: {
            'class': 'generic'
        },

        manage: true,
        template: coursesTemplate,
        serialize: function() {
            return {
                query: this.getQueryTitle(this.collection.query),
                courses: this.collection.toJSON(),
                ongoingFetch: this.collection.ongoingFetch
            };
        },

        beforeRender: function() { Backbone.trigger('domchange:title', this.collection.query); },

        getQueryTitle: function(query) {
            // this code hides the Solr query syntax to replace it by a user-friendly definition
            var COURSE_SUBJECT_FIELD = 'course_subject';
            if (query.substring(0, COURSE_SUBJECT_FIELD.length) === COURSE_SUBJECT_FIELD) {
                return "Skill: " + query.substring(COURSE_SUBJECT_FIELD.length+1, query.length);
            } else {
                return "Search: " + query;
            }
        },

        cleanup: function() {
            this.collection.off('reset', this.render, this);
        }
    });
    return CoursesView;
});
