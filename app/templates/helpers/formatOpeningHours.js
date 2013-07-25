define(["handlebars"], function(Handlebars) {
    function formatOpeningHours(string, td) {
        /**
         * Format opening hours and highlight the rule used if it is open
         * @param string: plain string containing opening hours
         * @param td: TimeDomain result object containing parsed rules
         * @return formatted string
         */
        if(!string) {
            return "";
        }
        try {
            var parts = string.split(";");
            var formatted = '';
            for (var part in parts) {
                var p = parts[part];
                // normalising to compare to what is used by TimeDomain
                var normalised = replaceAll(replaceAll(p, '-', ' - '), ',', ' , ').trim();
                // highlight if the rule used corresponds to normalised and
                // if it is open (otherwise usedrule corresponds to the last rule,
                // so it might not match appropriately)
                if (normalised === td.usedrule && td.value === true) {
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