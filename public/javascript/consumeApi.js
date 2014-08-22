var api = (function() {
  var opts = {
    lines: 7,
    length: 3,
    width: 9,
    radius: 14,
    corners: 1,
    rotate: 38,
    direction: 1,
    color: '#000',
    speed: 1,
    trail: 50,
    shadow: false,
    hwaccel: false,
    className: 'spinner',
    zIndex: 2e9,
    top: '50%',
    left: '50%'
  };  
  
  var post = function(url, data, cb) {
    var target = document.getElementById('spin');
    var spinner = new Spinner(opts).spin(target);
    $.ajax({
      type: 'POST',
      url: url,
      data: JSON.stringify(data) || {},
      contentType: 'application/json; charset=UTF-8',
      dataType: 'json',
      success: function(res){
        spinner.stop();
        $('#spin').remove();
        cb(res);
      },
      error: function(jqXHR, textStatus, errorThrown ){
        cb({msg: errorThrown});
      }
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
    'deleteCourse': 'Course/del',
    'contactForm': 'contact'
  };

  return {
    consume: function(nameFun, data, cb) {
      post(urls[nameFun], data, cb);
    }
  };
})();