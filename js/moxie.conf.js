define([], function() {
    var MoxieConf = {
        endpoint: 'http://api.m.ox.ac.uk',
        paths: {
            places_search: '/places/search',
            places_id: '/places/',
            dates: '/oxford_dates/',
			courses_search: '/courses/search',
			courses_subjects: '/courses/subjects',
			course_id: '/courses/course/',
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
