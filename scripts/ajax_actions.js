/*
* Various javascript fixes for embedded forms
*/

(function ($) {
  
  Drupal.ajax = Drupal.ajax || {};
  
  /**
  * Handle an event that triggers an Ajax response.
  *
  * When an event that triggers an Ajax response happens, this method will
  * perform the actual Ajax call. It is bound to the event using
  * bind() in the constructor, and it uses the options specified on the
  * ajax object.
  */
  Drupal.ajax.prototype.eventResponse = function (element, event) {
    // Create a synonym for this to reduce code confusion.
    var ajax = this;

    // Do not perform another ajax command if one is already in progress.
    if (ajax.ajaxing) {
      return false;
    }
    
    ajax.beforeAjaxActions(ajax.ajax_actions);
    ajax.serializeAjaxActions(ajax.ajax_actions, ajax.options);

    try {
      if (ajax.form) {
        // If setClick is set, we must set this to ensure that the button's
        // value is passed.
        if (ajax.setClick) {
          // Mark the clicked button. 'form.clk' is a special variable for
          // ajaxSubmit that tells the system which element got clicked to
          // trigger the submit. Without it there would be no 'op' or
          // equivalent.
          element.form.clk = element;
        }

        ajax.form.ajaxSubmit(ajax.options);
      }
      else {
        ajax.beforeSerialize(ajax.element, ajax.options);
        $.ajax(ajax.options);
      }
    }
    catch (e) {
      // Unset the ajax.ajaxing flag here because it won't be unset during
      // the complete response.
      ajax.ajaxing = false;
      alert("An error occurred while attempting to process " + ajax.options.url + ": " + e.message);
    }

    // For radio/checkbox, allow the default event. On IE, this means letting
    // it actually check the box.
    if (typeof element.type != 'undefined' && (element.type == 'checkbox' || element.type == 'radio')) {
      return true;
    }
    else {
      return false;
    }

  };
  
  /**
  * Execute any pre submit actions.
  *
  * This is mostly just important for ux tweaks, for instance when you delete
  * something using ajax you can add some call to a command here that removes
  * the item from the page before the call ever occurs, so the user sees instant
  * feedback.
  */
  Drupal.ajax.prototype.beforeAjaxActions = function (actions) {
    
  }
  
  /**
  * Include the ajax actions data.
  *
  * Ajax actions can be a deep array so on form calls we need to serialize the
  * ajax actions data before adding it to the data array. For link clicks we
  * can just throw it in with the other data.
  */
  Drupal.ajax.prototype.serializeAjaxActions = function (actions, options) {
    // If this is a form we need to serialize the data so that it returns
    // correctly in php as an array. Since we don't know the depth of the array
    // we used a nested recursive function.
    if (this.form) {
      Drupal.ajax.prototype.recursiveSerialize(actions, options, 'ajax_actions');
    }
    else {
      options.data['ajax_actions'] = actions;
    }
  }
  
  /**
  * Recursively attach the ajax actions array to the ajax data.
  *
  * This does all of the heavy lifting with the ajax actions data for forms.
  * Its important that we do this during the call, because we want to make sure
  * we are able to change it in its native array before pushing it into a
  * string to be passed back to the page.
  */
  Drupal.ajax.prototype.recursiveSerialize = function (obj, options, string) {
    var type, label;
    $.each(obj, function(key, value){
      // Check the type of data, and add the current key to the label.
      type = typeof(value);
      label = string + '[' + key + ']';
      
      // If we are looking at a property, add it to the data, go in another
      // level!
      if (type != 'object') {
        options.data[label] = value;
      }
      else {
        Drupal.ajax.prototype.recursiveSerialize(value, options, label);
      }
    })
  }
  
})(jQuery);