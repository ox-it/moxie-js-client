require(['jquery','backbone', 'router', 'fastclick', 'moxie.conf', 'favourites/views/FavouriteButtonView', 'favourites/collections/Favourites', 'backbone.queryparams', 'backbone.layoutmanager'], function($, Backbone, MoxieRouter, FastClick, conf, FavouriteButtonView, Favourites) {
    // Include FastClick, this removes a 300ms touch event delay
    $(function() {
        new FastClick(document.body);

        // Listen for events on each click on Android
        // This seems to be the only way to open links in the android browser
        //
        $(document).on("deviceready", function() {
            if ((window.device) && (window.device.platform==='Android')) {
                $('#content').on('click', "a[href][target='_blank']", function(ev) {
                    ev.preventDefault();
                    navigator.app.loadUrl(this.href, { openExternal:true });
                    return false;
                });
            }
        });
    });

    var favourites = new Favourites();
    var moxieRouter = new MoxieRouter({favourites: favourites});

    // Default to requesting hal+json but fallback to json
    $.ajaxSetup({ headers: { 'Accept': 'application/hal+json;q=1.0, application/json;q=0.9, */*; q=0.01' } });

    // Add an event listener for sending document title changes
    Backbone.on('domchange:title', function(title) {$(document).attr('title', conf.titlePrefix+title);}, this);

    // This kicks off the app -- discovering the hashchanges and calling routers
    Backbone.history.start();

    // We create the favouriteButtonView here since it relies on Backbone having the hash url data
    // This is only available after history.start()
    // NOTE: I was tempted to move it into router.init but it's a bad idea due to the above comment.
    var favouriteButtonView = new FavouriteButtonView({el: $('#favourite a'), collection: favourites});
    favouriteButtonView.updateButton();

    // Some simple events called on the default index page -- mostly for the sidebar menu
    $('#home a').click(function(ev) {
        ev.preventDefault();
        $('body').toggleClass('is-sidebar-active');
        return false;
    });
    $('#back a').click(function(ev) {
        ev.preventDefault();
        window.history.back();
        return false;
    });
    $('.overlay, #sidebar a').click(function(ev) {
        $('body').toggleClass('is-sidebar-active');
    });
});
