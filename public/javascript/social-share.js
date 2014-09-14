(function() {
  var button  = $('.social-share #expand-navigation');
  var wrapper = $('.social-share .wrapper');

  button.on('click', toggleNavigation);
  wrapper.find('li').on('click', toggleNavigation);
  
  function toggleNavigation() {
    wrapper.toggleClass('opened');
  } 
})();