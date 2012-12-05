define(['jquery', 'backbone', 'underscore', 'hbs!/handlebars/base', 'hbs!/handlebars/courses/bookings', 'leaflet', 'moxie.conf', 'courses/helpers'], 
	function($, Backbone, _, baseTemplate, bookingsTemplate, L, MoxieConf){
    var BookingsView = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this);
            $.ajax({
                url: MoxieConf.urlFor('courses_bookings'),
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                }
            }).success(this.renderCoursesList);
        },

        render: function() {
            this.$el.html(baseTemplate());
            return this;
        },

        renderCoursesList: function(data) {
            var list = this.$el.find('#list');
            if(data.courses.length > 0) {
                list.html(bookingsTemplate(data));
            } else {
                list.html("<h3>No bookings</h3>");
            }
        }
    });
    return BookingsView;
});
