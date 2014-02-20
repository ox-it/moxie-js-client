require(['jquery','backbone', 'router', 'fastclick', 'moxie.conf', 'ga', 'push', 'backbone.queryparams', 'backbone.layoutmanager', 'foundation'], function($, Backbone, MoxieRouter, FastClick, conf, GA, Push) {
    function startGA() {
        // Init GA & start listening on hashchange
        if (conf.ga) {
            var ga = new GA({debug: conf.ga.debug});
            ga.init(conf.ga.trackingID, conf.ga.period);
            ga.startListening();
        }
    }
    $(function() {
        //
        // Initialse our router
        var moxieRouter = new MoxieRouter();

        // Default to requesting hal+json but fallback to json
        $.ajaxSetup({ headers: { 'Accept': 'application/hal+json;q=1.0, application/json;q=0.9, */*; q=0.01' } });

        // Add an event listener for sending document title changes
        Backbone.on('domchange:title', function(title) {$(document).attr('title', conf.titlePrefix+title);}, this);

        // This kicks off the app -- discovering the hashchanges and calling routers
        Backbone.history.start();

        // Some simple events called on the default index page -- mostly for the sidebar menu
        $('#home a').click(function(ev) {
            ev.preventDefault();
            $('html').toggleClass('is-sidebar-active');
            return false;
        });
        $('#back a').click(function(ev) {
            ev.preventDefault();
            window.history.back();
            return false;
        });
        $('.overlay, #sidebar a').click(function(ev) {
            $('html').toggleClass('is-sidebar-active');
        });
        // Include FastClick, this removes a 300ms touch event delay
        new FastClick(document.body);

        var app = (document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1);
        if (app) {
            // Native application - Cordova
            $(document).on("deviceready", function() {
                // Now the GAPlugin will have loaded we can start sending analytics
                startGA();

                // Listen for events on each click on both Android and iOS
                // This seems to be the most reliable way to open target=_blank
                // url's in the native phone browsers.
                //
                var push;
                if ((window.device) && (window.device.platform==='Android')) {
                    if (conf.pushNotifications && conf.pushNotifications.android && conf.pushNotifications.android.enabled) {
                        push = new Push();
                        push.registerAndroid();
                    }
                    $('body').on('click', "a[href][target='_blank']", function(ev) {
                        ev.preventDefault();
                        navigator.app.loadUrl(this.href, { openExternal:true });
                        return false;
                    });
                }
                else if ((window.device) && (window.device.platform==='iOS')) {
                    if (conf.pushNotifications && conf.pushNotifications.ios && conf.pushNotifications.ios.enabled) {
                        push = new Push();
                        push.registeriOS();
                    }
                    $('body').on('click', "a[href][target='_blank']", function(ev) {
                        ev.preventDefault();
                        window.open(this.href, '_system');
                        return false;
                    });
                }
            });
        } else {
            // Load the GA plugin and start sending analytics
            startGA();
        }
    });
});
