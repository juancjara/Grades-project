var api = (function() {
  var post = function(url, data, cb) {
    $.ajax({
      type: 'POST',
      url: url,
      data: data || {},
      contentType: 'application/json; charset=UTF-8',
      dataType: 'json',
      success: cb
    });
  };
  var urls = {
    'getCourses' : 'User/getCourses',
    'addCourse': 'Course/add',
    'searchCourse': 'Course/search',
    'createCourse': 'Course/create',
    'updateCourse': 'Course/update',
    'getFormulaCourse': 'Course/getFormula',
    'shareCourse': 'Course/share',
    'deleteCourse': 'Couse/del',
    'logout': 'logout'
  };

  return {
    consume: function(nameFun, data, cb) {
      post(urls[nameFun], data, cb);
    };
  };
})();