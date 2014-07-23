define([], function() {
    var MoxieConf = {
        endpoint: '//m.ox.ac.uk/api',
        titlePrefix: 'Mobile Oxford - ',
        paths: {
            places_search: '/places/search',
            places_categories: '/places/types',
            places_id: '/places/',
            dates: '/dates/today',
            weather: '/weather/',
            rivers: '/rivers/',
            webcams: '/webcams/',
            courses_search: '/courses/search',
            courses_subjects: '/courses/subjects',
            courses_bookings: '/courses/bookings',
            course_id: '/courses/course/',
            presentation_id: '/courses/presentation/',
            courses_auth_verify: '/courses/oauth/verify',
            courses_auth_authorized: '/courses/oauth/authorized',
            courses_auth_authorize: '/courses/oauth/authorize',
            library_search: '/library/search',
            library_item: '/library/item:',
            contact_search: '/contact/search',
            events_list: '/events/search?from=now',
            events_id: '/events/',
            park_and_rides: '/transport/park-and-rides',
            feedback: '/feedback/',
            notifications_list: '/notifications/',
            notifications_id: '/notifications/',
            push_notification_register_gcm: '/notifications/register/gcm',
            push_notification_register_apns: '/notifications/register/apns'
        },
        urlFor: function(api_method) {
            return this.endpoint + this.paths[api_method];
        },
        pathFor: function(api_method) {
            return this.paths[api_method];
        },
        defaultLocation: {coords: {latitude: 51.752018, longitude: -1.257723}},
        mapbox: {key: 'mobileox.map-iihxb1dl'},
        map: {
            defaultZoom: 15,
            bounds: {exponent: 0.75, limit: 500, fallback: 5},
            phoneViewMediaQuery: "only screen and (max-width: 767px)",
            defaultTileLayerOptions:  {
                minZoom: 0,
                maxZoom: 18,
                // Detect retina - if true 4* map tiles are downloaded
                detectRetina: true
            }
        },
        position: {
            updateInterval: 60000,          // 60 seconds
            errorMargin: 50,                // 50 meters
            accuracyTimeout: 25000,         // 25 seconds
            maximumAge: 600000,             // 10 minutes
            enableHighAccuracy: true,       // Use the GPS if possible
        },
        news: {
            feeds: [
                    {"title": "University of Oxford - Media", "url": "http://www.ox.ac.uk/news_rss.rm", "slug": "offices-media"},
                    {"title": "Wolfson College", "url": "http://www.wolfson.ox.ac.uk/rss.xml", "slug": "wolfson"},
                    {"title": "Linacre College", "url": "http://www.linacre.ox.ac.uk/Linacre/news-and-events/news/RSS", "slug": "linacre"},
                    {"title": "Kellogg College", "url": "http://www.kellogg.ox.ac.uk/rss.xml", "slug": "kellogg"},
                    {"title": "Pembroke College", "url": "http://www.pmb.ox.ac.uk/news/rss.xml", "slug": "pmb"},
                    {"title": "Lady Margaret Hall news", "url": "http://www.lmh.ox.ac.uk/CMSPages/NewsRss.aspx", "slug": "lmh"},
                    {"title": "Oriel College", "url": "http://www.oriel.ox.ac.uk/news/rss", "slug": "oriel-news"},
                    {"title": "Somerville College", "url": "http://www.some.ox.ac.uk/191/News.rss", "slug": "some-news"},
                    {"title": "Department of Biochemistry", "url": "http://rss.oucs.ox.ac.uk/bioch/news/rss20.xml", "slug": "biochemistry-department"},
                    {"title": "Department of Computer Science", "url": "http://www.cs.ox.ac.uk/feeds/News-All.xml", "slug": "cs-news"},
                    {"title": "Department of International Development", "url": "http://www3.qeh.ox.ac.uk/rss/news_rss.php", "slug": "odid-news"},
                    {"title": "News from the RSL", "url": "http://www.bodleian.ox.ac.uk/science/news/rss", "slug": "ulib-science"},
                    {"title": "Mobile Oxford Team Blog", "url": "http://blog.m.ox.ac.uk/feeds/all.atom.xml", "slug": "mox-blog"},
                ],
            numberOfEntries: 10,
        },
        today: {
            nearbyRTI: {
                fetchCount: 5,      // Number of POIs we fetch to find 1 nearby which doesn't appear in your favourites
            }
        },
        security: {
            feed: null,
        },
        ga: {trackingID: "UA-40281467-3", period: 10, debug: true},
        pushNotifications: {
            ios: {
                enabled: false
            },
            android: {
                enabled: false,
                senderID: ""
            }
        }
    };
    return MoxieConf;
});
