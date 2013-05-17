define(['underscore', 'backbone', 'jquery'], function(_, Backbone, $) {
    var User = Backbone.Model.extend({
        checkAuthorization: function(options) {
            options = options || {};
            var authorized = options.authorized,
                unauthorized = options.unauthorized,
                error = options.error,
                verifier = options.verifier;
            var ajaxOptions = {
                success: _.bind(function(data) {
                    if (data.authorized === true) { authorized(); }
                    else if (data.authorized === false) { unauthorized(); }
                    else { error(); }
                }, this),
                error: error,
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
