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
        var view = Drupal.views.instances['views_dom_id:' + action.dom_id];
        action.view_settings = view.settings;
        
        if (view.$exposed_form.length) {
          action.view_form = view.$exposed_form.formSerialize();
        }
      }
    });
  }
  
})(jQuery);