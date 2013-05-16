define(['underscore', 'backbone', 'jquery'], function(_, Backbone, $) {
    var User = Backbone.Model.extend({
        checkAuthorization: function(options) {
            options = options || {};
            var success = options.success,
                failure = options.failure,
                verifier = options.verifier;
            var ajaxOptions = {
                success: success,
                error: failure,
                xhrFields: { withCredentials: true } // These requests must send cookies
            };
            if (verifier) {
                // User has just returned from the oAuth server
                _.extend(ajaxOptions, {
                    url: this.get('oAuthVerificationURL'),
                    data: {'oauth_verifier': verifier},
                    dataType: 'json'
                });
            } else {
                // is the user already authenticated?
                ajaxOptions.url = this.get('oAuthAuthorizedURL');
            }
            $.ajax(ajaxOptions);
        },
    });
    return User;
});
