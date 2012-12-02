(function ($) {
  
  Drupal.CTools = Drupal.CTools || {};
  Drupal.CTools.AJAX = Drupal.CTools.AJAX || {};
  Drupal.CTools.AJAX.commands = Drupal.CTools.AJAX.commands || {};
  
  Drupal.CTools.AJAX.commands.ajax_actions_trigger_refresh = function(data) {
    $(data.selector).trigger('ajaxActionsRefresh');
  }
  
  Drupal.CTools.AJAX.commands.settings = function(data) {
    $.extend(true, Drupal.settings, data.argument);
  };
  
  Drupal.behaviors.ajax_actions_refresh = function(context) {
    
    // Pull refresh information before heading back to the server.
    $('a.ajax-actions-refresh-link', context)
      .not('a.ajax-actions-refresh-link-processed')
      .addClass('ajax-actions-refresh-link-processed')
      .add('div.ajax-actions-refresh:not(.ajax-actions-refresh-processed)', context)
      .bind('ajaxActionsPresubmit', function(){
        
        var actions = $(this).data('ajax_actions').actions;
        
        $.each(actions, function(index, action) {
          if (action.op == 'refresh') {
            
            action.items = [];
            
            // Grab all of the relevant refresh information.
            $(action.selector).filter('.ajax-actions-refresh').each(function(count, item){
              var refreshData = $(this).data('ajax_actions_refresh');
              action.items[count] = refreshData;
              // Do any necessary overrides.
              $.extend(action.items[count], action.options);
            });
            
          }
        });
        
      });
    
    // Allow items to be refreshed directly as well.
    $('div.ajax-actions-refresh', context)
      .not('div.ajax-actions-refresh-processed')
      .addClass('ajax-actions-refresh-processed')
      .bind('ajaxActionsRefresh', function(){
        $(this).bind('ajaxActionsSubmit', Drupal.ajaxActions.clickAjaxLink);
        $(this).trigger('ajaxActionsPresubmit');
        $(this).trigger('ajaxActionsSubmit');
        return false;
      });

  };
})(jQuery);