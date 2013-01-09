define(['jquery', 'backbone', 'underscore', 'hbs!courses/templates/bookings', 'leaflet', 'moxie.conf'], 
    function($, Backbone, _, bookingsTemplate, L, MoxieConf){
    var BookingsView = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this);
        },

        render: function() {
            $.ajax({
                url: MoxieConf.urlFor('courses_bookings'),
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                }
            }).success(this.renderCoursesList);
            return this;
        },

        renderCoursesList: function(data) {
            if(data._embedded.length > 0) {
                this.$el.html(bookingsTemplate(data));
            } else {
                this.$el.html("<h3>No bookings</h3>");
            }
        }
    });
    return BookingsView;
});
