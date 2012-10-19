define([], function() {
    var MoxieConf = {
        endpoint: 'http://localhost:5000',
        paths: {
            places_search: '/places/search',
            places_id: '/places/',
            dates: '/dates/'
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
