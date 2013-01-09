(function ($) {
  
  Drupal.ajax = Drupal.ajax || {};
  Drupal.ajax.prototype = Drupal.ajax.prototype || {};
  Drupal.ajax.prototype.commands = Drupal.ajax.prototype.commands || {};
  
  /**
   * Add an additional ajax command for preparing to refresh a view.
   */
  Drupal.ajax.prototype.commands.ajax_actions_refresh_view = function(command, ajax) {
    $.each(ajax.ajax_actions.actions, function(key, action){
      if (action.op == 'refresh_view') {
        // Step through the views available on the page and see if they match
        // the selector that we passed in.
        $.each(Drupal.views.instances, function(index, view) {
          if (view.$view.is(action.selector)) {
            // If they do grab all of the settings and add them to ajax actions.
            var settings = $.extend({}, view.settings, action.view_settings);
            action.view_settings = settings;
            if (view.$exposed_form.length && typeof action.view_form == 'undefined') {
              action.view_form = view.$exposed_form.formSerialize();
            }
            return false;
          }
        })
        
      }
    });
  }
  
})(jQuery);