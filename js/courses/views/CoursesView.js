define(['jquery', 'backbone', 'underscore', 'hbs!/handlebars/base', 'hbs!/handlebars/courses/courses', 'leaflet', 'moxie.conf'], 
	function($, Backbone, _, baseTemplate, coursesTemplate, L, MoxieConf){
    var CoursesView = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this);
            $.ajax({
                url: MoxieConf.urlFor('courses_search') + "?q=" + this.options.query,
                dataType: 'json'
            }).success(this.renderCoursesList);
        },

        render: function() {
            $("#content").html(baseTemplate());
        },

        renderCoursesList: function(data) {
            $('#list').html(coursesTemplate(data));
        }
    });
    return CoursesView;
});
