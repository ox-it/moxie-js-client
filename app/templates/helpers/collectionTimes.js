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
        if(result.value === true) {
            return "<span class='label-place-closed'>collected</span>";
        } else {
            return "<span class='label-place-open'>not yet collected</span>";
        }
    }
    Handlebars.registerHelper('collectionTimes', collectionTimes);
    return collectionTimes;
});