define(["backbone", "jasmine", "today/views/CardView"], function(Backbone, jasmine, CardView) {
    describe("Ordering cards on the today view", function() {
        it("should place views with higher weights over others", function() {
            var testView = new Backbone.View({manage: true});
            var topView = new CardView({weight: 100, id: 'top'});
            var bottomView = new CardView({weight: 10, id: 'bottom'});
            testView.insertView(topView);
            testView.insertView(bottomView);
            topView.render();
            bottomView.render();
            var children = testView.$el.children();
            var topel = children[0];
            var bottomel = children[1];
            expect(topel.id).toBe('top');
            expect(bottomel.id).toBe('bottom');
        });
    });
});
