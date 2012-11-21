define(["backbone.hal","courses/models/CourseModel"], function(HAL, course) {

    var courses = HAL.Collection.extend({

        model: course

    });

    // Returns the Model class
    return courses;

});
