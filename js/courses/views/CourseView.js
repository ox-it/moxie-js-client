define(['jquery', 'backbone', 'underscore', 'handlebars', 'leaflet', 'moxie.conf'], 
	function($, Backbone, _, Handlebars, L, MoxieConf){
    var CourseView = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this);
            $.ajax({
                url: MoxieConf.urlFor('course_id') + this.options.id,
                dataType: 'json'
            }).success(this.renderCourse);
        },

        render: function() {
            // render basic view
            $("#content").html(Handlebars.templates.base());
        },

        renderCourse: function(data) {
            $('#list').html(Handlebars.templates.courses_course(data));
        }
    });
    return CourseView;
});
