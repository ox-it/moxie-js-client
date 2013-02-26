define([], function() {
    var MoxieConf = {
        endpoint: 'http://api.m.ox.ac.uk',
        titlePrefix: 'Mobile Oxford - ',
        paths: {
            places_search: '/places/search',
            places_categories: '/places/types',
            places_id: '/places/',
            dates: '/dates/today',
            courses_search: '/courses/search',
            courses_subjects: '/courses/subjects',
            courses_bookings: '/courses/bookings',
            course_id: '/courses/course/',
            presentation_id: '/courses/presentation/',
            courses_auth_verify: '/courses/oauth/verify',
            courses_auth_authorized: '/courses/oauth/authorized',
            courses_auth_authorize: '/courses/oauth/authorize',
            library_search: '/library/search',
            library_item: '/library/item:'
        },
        urlFor: function(api_method) {
            return this.endpoint + this.paths[api_method];
        },
        pathFor: function(api_method) {
            return this.paths[api_method];
        },
        geolocationInterval: 25000,
        defaultLocation: {coords: {latitude: 51.752018, longitude: -1.257723}},
        cloudmade: {key: 'b0a15b443b524d1a9739e92fe9dd8459'},
        mapbox: {key: 'mobileox.map-iihxb1dl'}
    };
    return MoxieConf;
});
