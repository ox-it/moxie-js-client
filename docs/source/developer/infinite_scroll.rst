.. highlight:: javascript
Infinite Scrolling
==================

To add infinite scrolling to your views simply extend ``core/views/InfiniteScrollView``, a simple example of this can be found in ``core/views/specs/infinite``::

        var TestInfiniteScroll = InfiniteScrollView.extend({
            attributes: {style: "height: 100px; overflow-y: scroll"},
            scrollThreshold: 0.5,
            scrollCallbacks: [function(){ scrollCallbackCalled = true; }],
            render: function() {
                this.$el.html('<h1 style="line-height: 500px">Hello overflow world</h1>');
                var windowScroll = false;
                InfiniteScrollView.prototype.initScroll.apply(this, [windowScroll, this.el]);
            }
        });

The key call here is to ``initScroll`` where we pass in  a ``Boolean`` for if we want our ``scrollCallbacks`` to be called after ``window.scroll`` events. Optionally you can also pass an element (scrolling with overflow-y) and listen to this elements ``scroll`` events.
