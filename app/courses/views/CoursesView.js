define(['jquery', 'backbone', 'underscore', 'hbs!courses/templates/courses', 'leaflet', 'moxie.conf'],
function($, Backbone, _, coursesTemplate, L, MoxieConf){
    var CoursesView = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this);
        },

        attributes: {
            'class': 'generic'
        },

        render: function() {
            $.ajax({
                url: MoxieConf.urlFor('courses_search') + "?q=" + this.options.query,
                dataType: 'json'
            }).success(this.renderCoursesList);
            Backbone.trigger('domchange:title', this.options.query);
        },

        renderCoursesList: function(data) {
            var context = {courses: data._embedded};
            if(context.courses.length > 0) {
                this.$el.html(coursesTemplate(context));
            } else {
                this.$el.html("<h3>No results</h3>");
            }
        }
    });
    return CoursesView;
});
