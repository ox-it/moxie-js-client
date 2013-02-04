define(["handlebars"], function(Handlebars) {
    function collectionTimes(string) {
        // Function that takes a collection times string and returns a 'true' if
        // it has been collected today else 'false'
        if(!string) {
            return "";
        }
        try {
            result = TimeDomain.evaluateNextTime(string);
        } catch (err) {
            console.log(err);
            return "";
        }
        if(result.times.length > 0) {
            next = result.times[0].t;
            // is the next collection time today?
            next.setHours(0);
            next.setMinutes(0);
            next.setSeconds(0);
            next.setMilliseconds(0);
            var today = new Date(new Date().setHours(0, 0, 0, 0));
            if(next.getTime() === today.getTime()) {
                return "<span class='label-place-open'>not yet collected</span>";
            } else {
                return "<span class='label-place-closed'>collected</span>";
            }
        } else {
            // no information on next collection time
            return "";
        }
    }
    Handlebars.registerHelper('collectionTimes', collectionTimes);
    return collectionTimes;
});