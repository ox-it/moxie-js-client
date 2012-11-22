define(['jquery', 'backbone', 'underscore', 'handlebars', 'leaflet', 'moxie.conf'], 
	function($, Backbone, _, Handlebars, L, MoxieConf){
    var CoursesView = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this);
            $.ajax({
                url: MoxieConf.urlFor('courses_search') + "?q=" + this.options.query,
                dataType: 'json'
            }).success(this.renderCoursesList);
        },

        render: function() {
            // render basic view
            $("#content").html(Handlebars.templates.base());
        },

        renderCoursesList: function(data) {
            $('#list').html(Handlebars.templates.courses_courses(data));
        }
    });
    return CoursesView;
});
