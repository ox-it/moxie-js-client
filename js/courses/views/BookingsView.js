define(['jquery', 'backbone', 'underscore', 'hbs!/handlebars/base', 'hbs!/handlebars/courses/', 'leaflet', 'moxie.conf'], 
	function($, Backbone, _, baseTemplate, coursesTemplate, L, MoxieConf){
    var BookingsView = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this);
            $.ajax({
                url: MoxieConf.urlFor('courses_bookings'),
                dataType: 'json'
            }).success(this.renderCoursesList);
        },

        render: function() {
            $("#content").html(baseTemplate());
        },

        renderCoursesList: function(data) {
            if(data.results.length > 0) {
                $('#list').html(coursesTemplate(data));
            } else {
                $('#list').html("<h3>No results</h3>");
            }
        }
    });
    return BookingsView;
});
