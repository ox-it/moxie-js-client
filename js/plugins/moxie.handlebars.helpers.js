define(["handlebars", "time_domain"], function(Handlebars, TimeDomain) {
    Handlebars.registerHelper('openingHours', function(string) {
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
    });

    Handlebars.registerHelper('humaniseDistance', function(distance) {
        distance = parseFloat(distance);
        if(distance >= 1.0) {
            return Math.round(distance*10)/10 + " km";
        } else {
            return Math.round(distance*1000) + " m";
        }
    });
});
