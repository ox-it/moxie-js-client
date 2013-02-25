define(["handlebars"], function(Handlebars) {
    function libraryAvailability(value) {
        // Function that takes an integer that will correspond to a CSS class.
        if (value === 0) {
            return "library-unavailable";
        } else if (value === 1) {
            return "library-unknown";
        } else if (value === 2) {
            return "library-stack";
        } else if (value === 3) {
            return "library-reference";
        } else if (value === 4) {
            return "library-available";
        } else {
            return "library-unknown";
        }
    }
    Handlebars.registerHelper('libraryAvailability', libraryAvailability);
    return libraryAvailability;
});