$(function() {
   $('.question').on('click', function(e) {
    e.preventDefault();
    var id = $(this).data('target');
    $(id).animate({'height':'toggle'});
   }); 
});