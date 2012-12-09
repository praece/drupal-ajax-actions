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
 */
function ajax_actions($options = array(), $commands = array()) {
  // Grab our array from the post data.
  $options = $_POST['ajax_actions'];
  
  if (is_array($options['actions'])) {
    // Check if any modules implement our hook, we do this instead of module
    // invoke all because we want to be able to pass all of our info by 
    // reference.
    $modules = module_implements('ajax_actions_commands');
    
    foreach ($options['actions'] as $delta => &$action) {
      // Attach a delta so you can find the action in the list of actions.
      $action['delta'] = $delta;
      $action['commands'] = $action['commands'] ? $action['commands'] : array();
      
      // Let users tell us to ignore certain things if they would like. If it 
      // isn't ignored, call all of the hooks.
      if (!$action['ignore']) {
        foreach ($modules as $module) {
          $func = $module . '_ajax_actions_commands';
          $func($action, $options);
        }
      }
   
      // Build a commands array.
      $commands = array_merge($commands, $action['commands']);
      
      // Let a hook request to stop here if they want to.
      if ($action['break'] == TRUE) {
        break;
      }
    }
  }
  
  // Let a user alter the commands array at the last minute.
  drupal_alter('ajax_actions_commands', $commands, $options);
  
  // Let ajax deliver do the fancy iframe file upload stuff.
  if ($commands) {
    ajax_deliver(array(
      '#commands' => $commands,
      '#type' => 'ajax',
    ));
  }
  else {
    ajax_deliver(NULL);
  }
}