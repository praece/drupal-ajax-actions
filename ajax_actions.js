/*
* Various javascript fixes for embedded forms
*/

(function ($) {
  Drupal.ajaxActions = Drupal.ajaxActions || {};
  
  Drupal.ajaxActions.clickAjaxLink = function() {
    if ($(this).hasClass('ajax-actions-ajaxing')) {
      return false;
    }

    var data = $(this).data('ajax_actions');
    
    $(this).addClass('ajax-actions-ajaxing');
    $('.ajax-actions-loader').addClass('ajax-actions-loading');
    
    try {
      $.ajax({
        type: "POST",
        url: data.settings.href,
        data: {'ajax_actions' : data},
        global: true,
        success: Drupal.CTools.AJAX.respond,
        error: function(xhr) {
          Drupal.ajaxActions.error(xhr, url);
        },
        complete: function() {
          $('.ajax-actions-ajaxing').removeClass('ajax-actions-ajaxing');
          $('.ajax-actions-loading').removeClass('ajax-actions-loading');
        },
        dataType: 'json'
      });
    }
    catch (err) {
      alert("An error occurred while attempting to process " + url);
      $('.ajax-actions-ajaxing').removeClass('ajax-actions-ajaxing');
      return false;
    }

    return false;
  };
  
  Drupal.ajaxActions.error = function(xhr, path) {
    var error_text = '';

    if ((xhr.status == 500 && xhr.responseText) || xhr.status == 200) {
      error_text = xhr.responseText;

      // Replace all &lt; and &gt; by < and >
      error_text = error_text.replace("/&(lt|gt);/g", function (m, p) {
        return (p == "lt")? "<" : ">";
      });

      // Now, replace all html tags by empty spaces
      error_text = error_text.replace(/<("[^"]*"|'[^']*'|[^'">])*>/gi,"");

      // Fix end lines
      error_text = error_text.replace(/[\n]+\s+/g,"\n");
    }
    else if (xhr.status == 500) {
      error_text = xhr.status + ': ' + Drupal.t("Internal server error. Please see server or PHP logs for error information.");
    }
    else {
      error_text = xhr.status + ': ' + xhr.statusText;
    }

    // XHR status of zero indicates that another page request was made during
    // the ajax request. Can't figure out how prevent this error, hide it for
    // now.
    if (console && console.log) {
      console.log(Drupal.t("An error occurred at @path.\n\nError Description: @error", {'@path': path, '@error': error_text}))
    }
  }

  /**
   * Additional responder commands for ctools.
   */
  
  Drupal.CTools = Drupal.CTools || {};
  Drupal.CTools.AJAX = Drupal.CTools.AJAX || {};
  Drupal.CTools.AJAX.commands = Drupal.CTools.AJAX.commands || {};
  
  Drupal.CTools.AJAX.commands.attach_behaviors = function(data) {
    Drupal.attachBehaviors($(data.selector));
  }
  
  Drupal.CTools.AJAX.commands.add_class = function(data) {
    $(data.selector).addClass(data.class);
    Drupal.attachBehaviors($(data.selector));
  }

  Drupal.CTools.AJAX.commands.remove_class = function(data) {
    $(data.selector).removeClass(data.class);
    Drupal.attachBehaviors($(data.selector));
  }
  
  Drupal.CTools.AJAX.commands.ajax_submit = function(data) {
    $(data.selector).submit();
  }
  
  Drupal.CTools.AJAX.commands.ajax_actions_bulk_data = function(data) {
    $.each(data.items, function(list, item){
      $(item.selector).addClass(item.class).data(item.key, item.value);
    })
    Drupal.attachBehaviors($('ajax-actions'));
  }

  Drupal.CTools.AJAX.commands.empty = function(data) {
    $(data.selector).empty();
  }
  
  /**
   * Bind links that will open modals to the appropriate function.
   */
  Drupal.behaviors.ajaxActions = function(context) {
    
    // Bind links
    $('a.ajax-actions-link', context)
      .not('a.ajax-actions-link-processed')
      .addClass('ajax-actions-link-processed')
      .click(function(){
        $(this).bind('ajaxActionsSubmit', Drupal.ajaxActions.clickAjaxLink);
        $(this).trigger('ajaxActionsPresubmit');
        $(this).trigger('ajaxActionsSubmit');
        return false;
      });
    
    if (!$('.ajax-actions-loader').length) {
      $('body').prepend('<div class="ajax-actions-loader">Loading</div>')
    }

  };
})(jQuery);