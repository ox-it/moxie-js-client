define('template/helpers/openingHours', ["handlebars"], function(Handlebars) {
    function openingHours(string) {
        if(!string) {
            return "";
        }
        try {
            result = TimeDomain.evaluateInTime(string);
        } catch (err) {
            console.log(err);
            return "";
        }
        if(result.value === true) {
            return " (open)";
        } else {
            return " (closed)";
        }
    }
    Handlebars.registerHelper('openingHours', openingHours);
    return openingHours;
});

define('template/helpers/humaniseDistance', ["handlebars", "time_domain"], function(Handlebars, TimeDomain) {
    function humaniseDistance(distance) {
        distance = parseFloat(distance);
        if(distance >= 1.0) {
            return Math.round(distance*10)/10 + " km";
        } else {
            return Math.round(distance*1000) + " m";
        }
    }
    Handlebars.registerHelper('humaniseDistance', humaniseDistance);
    return humaniseDistance;
});
