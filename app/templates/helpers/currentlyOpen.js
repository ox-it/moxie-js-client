define(["handlebars"], function(Handlebars) {
    function currentlyOpen(val) {
        // Function that takes a time string or a boolean value
        // and returns a formatted string open / closed
        if(typeof val === "boolean") {
            return format(val);
        }
        try {
            var result = TimeDomain.evaluateInTime(val);
        } catch (err) {
            return val;
        }
        return format(result.value);
    }
    function format(open) {
        if(open === true) {
            return "<span class='label-place-open'>open</span>";
        } else {
            return "<span class='label-place-closed'>closed</span>";
        }
    }
    Handlebars.registerHelper('currentlyOpen', currentlyOpen);
    return currentlyOpen;
});