define([], function() {
    var MoxieConf = {
        endpoint: 'http://127.0.0.1:5000',
        paths: {
            places_search: '/places/search',
            places_id: '/places/',
            dates: '/dates/',
			courses_search: '/courses/search',
			courses_subjects: '/courses/subjects',
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
