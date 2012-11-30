define(['jquery', 'backbone', 'underscore', 'hbs!/handlebars/base', 'hbs!/handlebars/courses/course', 'hbs!/handlebars/courses/auth_status', 'leaflet', 'moxie.conf'], 
	function($, Backbone, _, baseTemplate, courseTemplate, authTemplate, L, MoxieConf){
    var CourseView = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this);
			// Get course information
            $.ajax({
                url: MoxieConf.urlFor('course_id') + this.options.id,
                dataType: 'json'
            }).success([this.renderCourse, this.checkAuthorization])
                .error(this.handleError);
        },
		
        events: {
            'click .bookLink': "bookCourse",
        },

        render: function() {
            $("#content").html(baseTemplate());
            this.setElement($('#content'));
			this.delegateEvents(this.events);
        },

        renderCourse: function(data) {
            $('#list').html(courseTemplate(data));
        },
		
        renderAuthRequired: function() {
            data = {};
            data['authorized'] = false;
			data['authorization_url'] = this.authorization_url;
            $('#authStatus').html(authTemplate(data));
        },
    
        checkAuthorization: function(data) {
			// Check if user is logged in or not
			this.authorization_url = MoxieConf.urlFor('courses_auth_authorize')+ '?callback_uri=' + window.escape(window.location.href);
            if (this.options.params && this.options.params.oauth_verifier) {
                $.ajax({
                    url: MoxieConf.urlFor('courses_auth_verify'),
                    data: {'oauth_verifier': this.options.params.oauth_verifier},
                    dataType: 'json',
                    xhrFields: {
                        withCredentials: true
                    },
                }).success(this.verifyAuth)
                    .error(this.handleError);
			} else {
                this.renderAuthRequired();
            }
        },
        
		bookCourse: function(ev) {
			id = $(ev.currentTarget).attr("data-id");
            
            url = MoxieConf.urlFor('presentation_id') + id + "/book";
            
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
                },
            }).success(this.callbackBookCourse)
                .error(this.handleError);
			
		},
        
        callbackBookCourse: function(data) {
            console.log(data);
        },
		
		verifyAuth: function(data) {
            authorized = data['authorized'];
			data['authorization_url'] = this.authorization_url;
            $('#authStatus').html(authTemplate(data));
            if(authorized === "false") {
                $('.bookLink').hide();
            } else {
                $('.bookLink').show();
            }
            console.log('User authorized? ' + authorized)
		},
        
        handleError: function(data) {
            console.log(data);
        }
    });
    return CourseView;
});
