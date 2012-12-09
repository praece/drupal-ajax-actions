<?php

/**
 * Call hooks that implement ajax actions, then execute any commands.
 *
 * @param $options
 *   The post data from the ajax link.
 *
 * @param $commands
 *   An array of commands to be executed.
 *
 * @todo 
 *   Huge HACK! using parse_str and urldecode instead of just passing it
 *   because jQuery forms doesn't seem to want to take my object.
 *
 */

function ajax_actions($options = array(), $commands = array()) {
  // Grab our array from the post data.
  $options = $_POST['ajax_actions'];
  
  /*
  
  if (!is_array($options)) {
    // Extra steps here are to make sure any special html special chars are removed
    // this was causing issues when attempting to pass back emails.
    $options = urldecode($options);
    $options = html_entity_decode($options, ENT_QUOTES, 'UTF-8');
    parse_str($options, $options);
  }
  
  */
  
  dpm($_POST);
  dpm($options);
  
  if (is_array($options['actions'])) {
     
    // Check if any modules implement our hook, we do this instead of module
    // invoke all because we want to be able to pass all of our info by 
    // reference.
    $modules = module_implements('ajax_actions_commands');
    
    foreach ($options['actions'] as $delta => &$action) {
     
      $action['delta'] = $delta;
      
      // Let users tell us to ignore certain things if they would like.
      if (!$action['ignore']) {
        $action['commands'] = array();
        
        foreach ($modules as $module) {
          $func = $module . '_ajax_actions_commands';
          $func($action, $options);
        }
        
        if ($action['commands']) {
          $commands = array_merge($commands, $action['commands']);
        }
      }
      
      // Let a hook request to stop here if they want to.
      if ($action['break'] == TRUE) {
        $action['break'] == 'false';
        break;
      }
      
    }
  }
  
  // Let a user alter the commands array at the last minute.
  drupal_alter('ajax_actions_commands', $commands, $options);
  
  // If a command array has been created, return the data to the page as json.
  if ($commands) {
    print ajax_render($commands);
  }
  
  // Perform end-of-request tasks.
  ajax_footer();
}