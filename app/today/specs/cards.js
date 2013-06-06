define(["backbone", "jquery", "underscore", "jasmine", "today/views/CardView"], function(Backbone, $, _, jasmine, CardView) {
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
        it("Should correctly order cards regardless of insertion order", function() {
            var testView = new Backbone.View({manage: true});
            var topView = new CardView({weight: 100, id: 'top'});
            var middleView = new CardView({weight: 50, id: 'middle'});
            var bottomView = new CardView({weight: 10, id: 'bottom'});
            testView.insertView(topView);
            testView.insertView(bottomView);
            testView.insertView(middleView);
            topView.render();
            bottomView.render();
            middleView.render();
            var children = testView.$el.children();
            var topel = children[0];
            var middleel = children[1];
            var bottomel = children[2];
            expect(topel.id).toBe('top');
            expect(middleel.id).toBe('middle');
            expect(bottomel.id).toBe('bottom');
        });
        it("Should correctly order many cards", function() {
            var testView = new Backbone.View({manage: true});
            var weights = _.range(100);
            var weightsShuffled = _.shuffle(weights);
            _.each(weightsShuffled, function(weight) {
                var view = new CardView({weight: weight});
                testView.insertView(view);
                view.render();
            });
            var children = testView.$el.children();
            _.each(children, function(child) {
                expect($(child).data('weight')).toBe(weights.pop());
            });
        });
    });
});
