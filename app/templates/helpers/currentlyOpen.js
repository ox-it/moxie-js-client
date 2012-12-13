define(["handlebars"], function(Handlebars) {
    function currentlyOpen(string) {
        // Function that takes a time string and returns a 'true' if open
        // 'false' if not. 
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
            return "<span class='label-place-open'>open</span>";
        } else {
            return "<span class='label-place-closed'>closed</span>";
        }
    }
    Handlebars.registerHelper('currentlyOpen', currentlyOpen);
    return currentlyOpen;
});