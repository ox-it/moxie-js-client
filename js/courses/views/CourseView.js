define(['jquery', 'backbone', 'underscore', 'hbs!/handlebars/base', 'hbs!/handlebars/courses/course', 'leaflet', 'moxie.conf'], 
	function($, Backbone, _, baseTemplate, courseTemplate, L, MoxieConf){
    var CourseView = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this);
            $.ajax({
                url: MoxieConf.urlFor('course_id') + this.options.id,
                dataType: 'json'
            }).success(this.renderCourse);
        },

        render: function() {
            $("#content").html(baseTemplate());
        },

        renderCourse: function(data) {
            $('#list').html(courseTemplate(data));
        }
    });
    return CourseView;
});
