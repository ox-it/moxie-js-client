define(['jquery', 'backbone', 'underscore', 'hbs!courses/templates/base_course', 'hbs!courses/templates/course', 'hbs!courses/templates/auth_status', 'leaflet', 'moxie.conf', 'places/views/EmbeddedPoiView', 'hbs!places/templates/embedded_poi'],
    function($, Backbone, _, baseTemplate, courseTemplate, authTemplate, L, MoxieConf, EmbeddedPoiView){
        var CourseView = Backbone.View.extend({

            initialize: function() {
                this.user = this.options.user;
            },

            events: {
                'click .bookLink': "bookCourse"
            },

            attributes: {
                'class': 'generic free-text'
            },

            manage: true,
            template: courseTemplate,
            serialize: function() {
                return {course: this.model.toJSON()};
            },

            afterRender: function() {
                var presentations = this.model.get('presentations');
                if (presentations) {
                    _.each(presentations, function(presentation) {
                        if (presentation.location) {
                            var poid = presentation.location;
                            var element = this.$("#poi-" + poid.replace(":", "\\:"));
                            var poi = new EmbeddedPoiView({el: element, poid: poid});
                            poi.render();
                        }
                    });
                }
                Backbone.trigger('domchange:title', this.model.get('title'));
                var cb = _.bind(this.renderAuthorized, this);
                var options = {authorized: cb, unauthorized: cb};
                if (this.options.params && this.options.params.oauth_verifier) {
                    options.verifier = this.options.params.oauth_verifier;
                }
                this.user.checkAuthorization(options);
            },

            bookCourse: function(ev) {
                // TODO: This should really be using the _links
                // However they're on the embedded elements in the response, could be tricky?
                var id = this.$(ev.currentTarget).attr("data-id");
                var url = MoxieConf.urlFor('presentation_id') + id + "/booking";
                // TODO: We need to send supervisor credentials
                var data = {'jsj': 'ksjdjf', 'sjsj': 'ksjsj' };

                $.ajax({
                    url: url,
                    data: JSON.stringify(data),
                    processData: false,
                    dataType: 'json',
                    contentType: 'application/json',
                    type: 'POST',
                    xhrFields: {
                        withCredentials: true
                    }
                }).success(this.callbackBookCourse);
            },

            callbackBookCourse: function(data) {
                alert("Course booked!");
            },

            renderAuthorized: function(data) {
                data.authorization_url = MoxieConf.urlFor('courses_auth_authorize')+ '?callback_uri=' + window.escape(window.location.href);
                this.$('#authStatus').html(authTemplate(data));
            },

        });
        return CourseView;
    });
