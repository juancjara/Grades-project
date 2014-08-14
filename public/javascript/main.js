var main = {
  init: function(api) {
    var courseList = courseSearch(api);
    var my_list = course(api);

    var selected_handler = function(course, elem) {
      $('.active').removeClass('active');
      elem.addClass('active');
      $('.click-menu').hide();
      elem.find('.click-menu').show();
      console.log(course);
    };

    my_list.selected_handler = selected_handler;

    courseList.add_handler = my_list.add;
    courseList.selected_handler = selected_handler;
    courseList.new_course_handler = my_list.create;
  }
}
$(function() {
  main.init(api);
});
