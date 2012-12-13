define(["handlebars", "time_domain"], function(Handlebars, TimeDomain) {
    function humaniseDistance(distance) {
        distance = parseFloat(distance);
        if(distance >= 1.0) {
            return Math.round(distance*10)/10 + "km";
        } else {
            return Math.round(distance*1000) + "m";
        }
    }
    Handlebars.registerHelper('humaniseDistance', humaniseDistance);
    return humaniseDistance;
});
