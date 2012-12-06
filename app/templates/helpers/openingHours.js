define(["handlebars"], function(Handlebars) {
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
