define([], function() {
    var MoxieConf = {
        endpoint: 'http://new.m.ox.ac.uk/api',
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
            events_list: '/events/today',
            events_id: '/events/event/'
        },
        urlFor: function(api_method) {
            return this.endpoint + this.paths[api_method];
        },
        pathFor: function(api_method) {
            return this.paths[api_method];
        },
        defaultLocation: {coords: {latitude: 51.752018, longitude: -1.257723}},
        mapbox: {key: 'mobileox.map-iihxb1dl'},
        map: {bounds: {exponent: 0.75, limit: 500, fallback: 5}},
        position: {
            updateThrottle: 5000
        },
        news: {
            feeds: [
                    {"title": "University of Oxford - Media", "url": "http://www.ox.ac.uk/news_rss.rm", "slug": "offices-media"},
                    {"title": "Wolfson College", "url": "http://www.wolfson.ox.ac.uk/rss.xml", "slug": "wolfson"},
                    {"title": "Linacre College", "url": "http://www.linacre.ox.ac.uk/Linacre/news-and-events/news/RSS", "slug": "linacre"},
                    {"title": "Lady Margaret Hall news", "url": "http://www.lmh.ox.ac.uk/CMSPages/NewsRss.aspx", "slug": "lmh"},
                    {"title": "Oriel College", "url": "http://www.oriel.ox.ac.uk/news/rss", "slug": "oriel-news"},
                    {"title": "St. Antony's College Events", "url": "http://www.google.com/calendar/feeds/it-support%40sant.ox.ac.uk/public/basic?orderby=starttime&sortorder=ascending&futureevents=true&singleevents=true", "slug": "st-antonys-events"},
                    {"title": "Mobile Oxford Team Blog", "url": "http://blog.m.ox.ac.uk/feeds/all.atom.xml", "slug": "mox-blog"},
                    {"title": "Department of Biochemistry", "url": "http://rss.oucs.ox.ac.uk/bioch/news/rss20.xml", "slug": "biochemistry-department"},
                    {"title": "Department of Computer Science", "url": "http://www.cs.ox.ac.uk/feeds/News-All.xml", "slug": "cs-news"},
                    {"title": "News from the RSL", "url": "http://rss.oucs.ox.ac.uk/oxitems/generatersstwo2.php?channel_name=ulib/science", "slug": "ulib-science"},
                    {"title": "Student News Twitter Feed", "url": "https://api.twitter.com/1/statuses/user_timeline.rss?screen_name=uniofoxfordsi", "slug": "student-news-twitter"},
                    {"title": "Somerville College ROQ Blog", "url": "http://roq.some.ox.ac.uk/?feed=atom", "slug": "some-roq"},
                    {"title": "Oxford University Rowing Club Twitter Feed", "url": "http://twitter.com/statuses/user_timeline/5741492.rss", "slug": "rowing-club"},
                    {"title": "ClimatePrediction.net", "url": "http://climateprediction.net/rss.xml", "slug": "climate-predication"},
                ],
            numberOfEntries: 10,
        }
    };
    return MoxieConf;
});
