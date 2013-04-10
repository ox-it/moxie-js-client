define(['jquery', 'backbone', 'underscore', 'hbs!courses/templates/base_course', 'hbs!courses/templates/course', 'hbs!courses/templates/auth_status', 'leaflet', 'moxie.conf', 'places/views/EmbeddedPoiView', 'hbs!places/templates/embedded_poi'],
    function($, Backbone, _, baseTemplate, courseTemplate, authTemplate, L, MoxieConf, EmbeddedPoiView){
        var CourseView = Backbone.View.extend({

            initialize: function() {
                _.bindAll(this);
            },

            events: {
                'click .bookLink': "bookCourse"
            },

            attributes: {
                'class': 'generic free-text'
            },

            render: function() {
                this.$el.html(baseTemplate());
                // Get course information
                $.ajax({
                    url: MoxieConf.urlFor('course_id') + this.options.id,
                    dataType: 'json'
                }).success([this.renderCourse, this.checkAuthorization])
                .error(this.handleError);
                return this;
            },

            renderCourse: function(data) {
                this.$("#loading").hide();
                this.$("#item").html(courseTemplate(data));
                var presentations = data._embedded.presentations;
                for (var i=0;i<presentations.length;i++) {
                    if (presentations[i].location) {
                        var poid = presentations[i].location;
                        var element = this.$("#poi-" + poid.replace(":", "\\:"));
                        var poi = new EmbeddedPoiView({el: element, poid: poid});
                        poi.render();
                    }
                }
                Backbone.trigger('domchange:title', data.title);
            },

            renderAuthRequired: function() {
                data = {};
                data.authorized = false;
                data.authorization_url = this.authorization_url;
                this.$('#authStatus').html(authTemplate(data));
            },

            checkAuthorization: function(data) {
                this.authorization_url = MoxieConf.urlFor('courses_auth_authorize')+ '?callback_uri=' + window.escape(window.location.href);
                // Check if the user has to be verified (back from oauth auth)
                if (this.options.params && this.options.params.oauth_verifier) {
                    $.ajax({
                        url: MoxieConf.urlFor('courses_auth_verify'),
                        data: {'oauth_verifier': this.options.params.oauth_verifier},
                        dataType: 'json',
                        xhrFields: {
                            withCredentials: true
                        }
                    }).success(this.verifyAuth).error(this.handleError);
                } else {
                    // Check if the user is authorized
                    $.ajax({
                        url: MoxieConf.urlFor('courses_auth_authorized'),
                        dataType: 'json',
                        xhrFields: {
                            withCredentials: true
                        }
                    }).success(this.verifyAuth).error(this.handleError);
                    this.renderAuthRequired();
                }
            },

            bookCourse: function(ev) {
                // TODO: This should really be using the _links
                // However they're on the embedded elements in the response, could be tricky?
                var id = this.$(ev.currentTarget).attr("data-id");
                var url = MoxieConf.urlFor('presentation_id') + id + "/booking";
                // TODO: We need to send supervisor credentials
                data = {'jsj': 'ksjdjf', 'sjsj': 'ksjsj' };

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
                }).success(this.callbackBookCourse)
                .error(this.handleError);

            },

            callbackBookCourse: function(data) {
                alert("Course booked!");
            },

            verifyAuth: function(data) {
                data.authorization_url = this.authorization_url;
                this.$('#authStatus').html(authTemplate(data));
                if(data.authorized === false) {
                    $('.bookable').hide();
                } else {
                    $('.bookable').show();
                }
                console.log('User authorized? ' + data.authorized);
            },

            handleError: function(data) {
                console.log(data);
            }
        });
        return CourseView;
    });
