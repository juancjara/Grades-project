var contact = {
  init: function(api) {
    $('#contact').on('submit',function(e) {
      e.preventDefault();
      var formData = {
        type: $('#msg-type').find('option:selected').text(),
        title : $('#title').val(),
        msg: $('#msg').val(),
        email: $('#email').val()
      };
      api.consume('contactForm', formData, function(res) {
        $("#text").text("Enviado");
        $(".alert").show();
        setTimeout(function() {
        $(".alert").fadeOut('slow')},1000);
        e.preventDefault();
      });
    });
  }
};

$(function() {
  $('#about').addClass('active');
  contact.init(api);
});