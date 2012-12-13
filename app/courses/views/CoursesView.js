define(['jquery', 'backbone', 'underscore', 'hbs!courses/templates/courses', 'leaflet', 'moxie.conf'],
function($, Backbone, _, coursesTemplate, L, MoxieConf){
    var CoursesView = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this);
        },

        render: function() {
            $.ajax({
                url: MoxieConf.urlFor('courses_search') + "?q=" + this.options.query,
                dataType: 'json'
            }).success(this.renderCoursesList);
        },

        renderCoursesList: function(data) {
            if(data.results.length > 0) {
                this.$el.html(coursesTemplate(data));
            } else {
                this.$el.html("<h3>No results</h3>");
            }
        }
    });
    return CoursesView;
});
