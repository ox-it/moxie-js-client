define(['jquery', 'backbone', 'underscore', 'handlebars', 'moxie.conf'], function($, Backbone, _, Handlebars, MoxieConf){
    var ListView = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this);
            //this.render();
            if (this.options.params && this.options.params.oauth_verifier) {
                $.ajax({
                    url: MoxieConf.urlFor('courses_auth_verify'),
                    data: {'oauth_verifier': this.options.params.oauth_verifier},
                    dataType: 'json',
                    xhrFields: {
                        withCredentials: true
                    },
                }).success(this.request_courses);
            } else {
                this.request_courses();
            }
        },

        request_courses: function() {
            $.ajax({
                url: MoxieConf.urlFor('courses_list'),
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                },
                success: [this.renderCourseList],
            });
        },

        render: function() {
            // render basic view
            $("#content").html(Handlebars.templates.base());

        },

        renderCourseList: function(data) {
            $('#list').html(Handlebars.templates.course_list(data));
            $.ajax({
                url: MoxieConf.urlFor('courses_auth_authorized'),
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                },
                success: [this.renderAuthStatus],
            });
        },

        renderAuthStatus: function(data, textStatus) {
            data['authorization_url'] = MoxieConf.urlFor('courses_auth_authorize')+ '?callback_uri=' + window.escape(window.location.href);
            $('#auth-status').html(Handlebars.templates.course_auth_status(data));
        }
    });
    return ListView;
});
