(function ($) {
  
  Drupal.behaviors.ajaxActionsForms = {
    
    attach: function (context, settings) {
      $('.form-actions input.ajax-processed').closest('form')
        .find('input.form-text')
        .once('ajax-actions-forms-enter-submit')
        .on('keydown', function(event) {
          if (event.which == '13') {
            $(this).closest('form').find('.form-actions input.ajax-processed').trigger('mousedown');
            return false;
          }
        });
    }
    
  };
  
})(jQuery);