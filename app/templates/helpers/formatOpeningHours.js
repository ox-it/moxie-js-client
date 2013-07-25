define(["handlebars"], function(Handlebars) {
    function formatOpeningHours(string) {
        // format opening hours by splitting on ; and highlighting
        // the rule used to decide if it is open or not
        if(!string) {
            return "";
        }
        try {
            var result = TimeDomain.evaluateInTime(string);
            var parts = string.split(";");
            var formatted = '';
            for (var part in parts) {
                var p = parts[part];
                // normalising to compare to what is used by TimeDomain
                var normalised = replaceAll(replaceAll(p, '-', ' - '), ',', ' , ').trim();
                if (normalised === result.usedrule) {
                    formatted += "<strong>" + p + "</strong><br />";
                } else {
                    formatted += p + "<br />";
                }
            }
            return formatted;
        } catch (err) {
            return string;
        }
    }
    function replaceAll(string, target, replacement) {
        var parts = string.split(target);
        for (var part in parts) {
            parts[part] = parts[part].trim();
        }
        return parts.join(replacement);
    }
    Handlebars.registerHelper('formatOpeningHours', formatOpeningHours);
    return formatOpeningHours;
});