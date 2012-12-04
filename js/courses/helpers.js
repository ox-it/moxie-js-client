define('template/helpers/dateFormat', ["handlebars"], function(Handlebars) {
    function dateFormat(string) {
        if(!string) {
            return "";
        }
        try {
            date = new Date(string);
            return date.getDate() +  "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
        } catch (err) {
            console.log(err);
            return "";
        }
    }
    Handlebars.registerHelper('dateFormat', dateFormat);
    return dateFormat;
});
