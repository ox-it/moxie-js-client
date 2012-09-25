define(["handlebars"], function(Handlebars) {
    Handlebars.registerHelper('openingHours', function(string) {
        if(string === "") {
            return ""
        }
        result = TimeDomain.evaluateInTime(string);
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
