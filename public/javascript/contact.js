var contact = {
  init: function(api) {
    $('#contact').on('submit',function(e) {
      var formData = {
        type: $('#msg-type').find('option:selected').text(),
        title : $('#title').val(),
        msg: $('#msg').val()     
      };
      console.log(formData);
      api.consume('contactForm', formData, function(err) {

      });
      e.preventDefault();
    });
  }
};

$(function() {
  $('#about').addClass('active');
  contact.init(api);
});