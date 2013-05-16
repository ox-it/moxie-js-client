define(["jquery", "backbone", "jasmine", "core/views/InfiniteScrollView"], function($, Backbone, jasmine, InfiniteScrollView) {
    describe("Scrolling within an overflowing div", function() {
        var scrollCallbackCalled;
        var TestInfiniteScroll = InfiniteScrollView.extend({
            attributes: {style: "height: 100px; overflow-y: scroll"},
            scrollCallbacks: [function(){ scrollCallbackCalled = true; }],
            render: function() {
                this.$el.html('<h1 style="line-height: 500px">Hello overflow world</h1>');
                var options = {windowScroll: false, scrollElement: this.el, scrollThreshold: 0.5};
                InfiniteScrollView.prototype.initScroll.apply(this, [options]);
            }
        });
        var scroll;
        beforeEach(function() {
            scrollCallbackCalled = false;
            scroll = new TestInfiniteScroll();
            scroll.render();
            $('body').append($('<div id="sandbox"></div>'));
            $('#sandbox').append(scroll.el);
        });
        afterEach(function() {
            $('#sandbox').remove();
            scroll.remove();
        });
        it("Should fire the callback once over the scrollThreshold", function() {
            scroll.el.scrollTop = ((scroll.el.scrollHeight*scroll.scrollThreshold) - scroll.el.clientHeight) + 1;

            // Manually trigger the scroll event, since we're not really scrolling
            scroll.$el.scroll();
            // Manually fire what we default to every 250ms
            scroll.handleScroll();

            expect(scrollCallbackCalled).toBe(true);
        });
        it("Should fire the callback precisely upon the scrollThreshold", function() {
            scroll.el.scrollTop = ((scroll.el.scrollHeight*scroll.scrollThreshold) - scroll.el.clientHeight);

            // Manually trigger the scroll event, since we're not really scrolling
            scroll.$el.scroll();
            // Manually fire what we default to every 250ms
            scroll.handleScroll();

            expect(scrollCallbackCalled).toBe(true);
        });
        it("Shouldn't fire the callback just below scrollThreshold", function() {
            scroll.el.scrollTop = ((scroll.el.scrollHeight*scroll.scrollThreshold) - scroll.el.clientHeight) -1;
            scroll.$el.scroll();
            scroll.handleScroll();
            expect(scrollCallbackCalled).toBe(false);

        });
    });
});
