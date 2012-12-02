/*
* Various javascript fixes for embedded forms
*/

(function ($) {
  Drupal.ajaxActionsForms = Drupal.ajaxActionsForms || {};

  Drupal.ajaxActionsForms.clickAjaxButton = function() {
    if ($(this).hasClass('ajax-actions-ajaxing')) {
      return false;
    }
    
    // Put our button in.
    this.form.clk = this;

    $(this).addClass('ajax-actions-ajaxing');
    
    var object = $(this);
    try {
      var form = this.form;
      url = $(form).attr('action');
      setTimeout(function() { Drupal.ajaxActionsForms.ajaxSubmit(form, url); }, 1);
    }
    catch (err) {
      alert("An error occurred while attempting to process " + url);
      $('.ajax-actions-ajaxing').removeClass('ajax-actions-ajaxing');
      return false;
    }
    return false;
  };

  /**
   * Event handler to submit an AJAX form.
   *
   * Using a secondary event ensures that our form submission is last, which
   * is needed when submitting wysiwyg controlled forms, for example.
   */
  Drupal.ajaxActionsForms.ajaxSubmit = function (form, url) {
    $form = $(form);

    if ($form.hasClass('ajax-actions-ajaxing')) {
      return false;
    }
    
    $form.addClass('ajax-actions-ajaxing');
    $('.ajax-actions-loader').addClass('ajax-actions-loading');
    
    // HACK .ajaxSubmit isn't successfully passing an object like .ajax does
    // so we pre-serialize it and clean things up on the other side.
    // someday this definitely needs to be changed.
    var data = $.param($(form).data('ajax_actions'));
    
    try {

      var ajaxOptions = {
        type: "POST",
        url: url,
        data: {'ajax_actions': data},
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
      };

      // If the form requires uploads, use an iframe instead and add data to
      // the submit to support this and use the proper response.
      if ($form.attr('enctype') == 'multipart/form-data') {
        $form.append('<input type="hidden" name="ctools_multipart" value="1">');
        ajaxIframeOptions = {
          success: Drupal.CTools.AJAX.iFrameJsonRespond,
          iframe: true
        };
        ajaxOptions = $.extend(ajaxOptions, ajaxIframeOptions);
      }

      $form.ajaxSubmit(ajaxOptions);
    }
    catch (err) {
      alert("An error occurred while attempting to process " + url);
      $('.ajax-actions-ajaxing').removeClass('ajax-actions-ajaxing');
      return false;
    }
  };
  
  /**
   * Bind links that will open modals to the appropriate function.
   */
  Drupal.behaviors.ajaxActionsForms = function(context) {

    // Bind buttons
    $('input.ajax-actions-link', context)
      .not('input.ajax-actions-link-processed')
      .addClass('ajax-actions-link-processed')
      .click(function(){
        $(this).bind('ajaxActionsFormsSubmit', Drupal.ajaxActionsForms.clickAjaxButton);
        $(this).trigger('ajaxActionsFormsPresubmit');
        $(this).trigger('ajaxActionsFormsSubmit');
        return false;
      });
    
    var elements = $('.embedded-forms-container', context).not('embedded-forms-container-focus-processed');
      
    // Focus on first visible form item in embedded form, if first item is a wysiwyg then focus on its iframe
    if ($('.form-item:visible:first', elements).next('.wysiwyg').length > 0) {
      setTimeout("$('.embedded-forms-container .form-item:first iframe').focus();", 1000);
    }
    else {
      $('.form-item:visible:first input:not(.hasDatepicker, .form-submit), .form-item:visible:first textarea', elements).focus();
    }
    
    elements.addClass('embedded-forms-container-focus-processed');

  };
})(jQuery);