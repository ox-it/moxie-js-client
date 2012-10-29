define([], function() {
    var MoxieConf = {
        endpoint: 'http://api.m.ox.ac.uk',
        paths: {
            places_search: '/places/search',
            places_id: '/places/',
            dates: '/dates/',
            courses_list: '/weblearn/courses',
            courses_auth_verify: '/weblearn/oauth/verify',
            courses_auth_authorized: '/weblearn/oauth/authorized',
            courses_auth_authorize: '/weblearn/oauth/authorize',
        },
        urlFor: function(api_method) {
            return this.endpoint + this.paths[api_method];
        },
        pathFor: function(api_method) {
            return this.paths[api_method];
        }
    };
    return MoxieConf;
});
