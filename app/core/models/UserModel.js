define(['underscore', 'app/core/models/MoxieModel', 'jquery'], function(_, MoxieModel, $) {
    var User = MoxieModel.extend({
        checkAuthorization: function(options) {
            options = options || {};
            var authorized = options.authorized,
                unauthorized = options.unauthorized,
                error = options.error,
                verifier = options.verifier;
            var ajaxOptions = {
                success: _.bind(function(data) {
                    if (data.authorized === true && _.isFunction(authorized)) { authorized(data); }
                    else if (data.authorized === false && _.isFunction(unauthorized)) { unauthorized(data); }
                    else if (_.isFunction(error)) { error(data); }
                }, this),
                error: error,
                xhrFields: { withCredentials: true } // These requests must send cookies
            };
            if (verifier) {
                // User has just returned from the oAuth server
                ajaxOptions.url = this.get('oAuthVerificationURL');
                ajaxOptions.data = {'oauth_verifier': verifier};
            } else {
                // is the user already authenticated?
                ajaxOptions.url = this.get('oAuthAuthorizedURL');
            }
            ajaxOptions.dataType = 'json';
            $.ajax(ajaxOptions);
        },
    });
    return User;
});
