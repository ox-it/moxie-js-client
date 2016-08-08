define(['jquery', 'backbone', 'underscore', 'hbs!app/courses/templates/base_bookings', 'hbs!app/courses/templates/bookings', 'leaflet', 'app/moxie.conf'],
    function($, Backbone, _, baseTemplate, bookingsTemplate, L, MoxieConf){
    var BookingsView = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this);
        },

        events: {
            'click .updateStatus': "updateStatus",
            'click .withdrawBooking': "withdrawBooking"
        },

        render: function() {
            this.$el.html(baseTemplate());
            $.ajax({
                url: MoxieConf.urlFor('courses_bookings'),
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                }
            }).success(this.renderCoursesList);
            Backbone.trigger('domchange:title', "My bookings");
            return this;
        },

        updateStatus: function(e) {
            e.preventDefault();
            $(e.target).parent().siblings().show();
            return false;
        },

        withdrawBooking: function(e) {
            // Makes a DELETE ajax call to the API to remove a booking
            e.preventDefault();
            var presentation_id = $(e.target).parent().parent().data('id');
            var url = MoxieConf.urlFor('presentation_id') + presentation_id + '/booking';
            $.ajax({
                url: url,
                type: 'DELETE',
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                }
            }).success(this.render);
            return false;
        },

        renderCoursesList: function(data) {
            if(data._embedded.length > 0) {
                this.$("#result").html(bookingsTemplate(data));
            } else {
                this.$("#result").html("<h2>No bookings</h2>");
            }
        }
    });
    return BookingsView;
});
