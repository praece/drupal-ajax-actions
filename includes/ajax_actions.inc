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
  $options = $_POST['ajax_actions'];
  
  dpm($options, 'after');
  
  /*
  
  if (!is_array($options)) {
    // Extra steps here are to make sure any special html special chars are removed
    // this was causing issues when attempting to pass back emails.
    $options = urldecode($options);
    $options = html_entity_decode($options, ENT_QUOTES, 'UTF-8');
    parse_str($options, $options);
  }
  
  $_GET['q'] = $options['settings']['path'];
  
  ajax_actions_includes($options);
  
  if (is_array($options['actions'])) {
    foreach ($options['actions'] as $delta => &$action) {
     
      $action['delta'] = $delta;
      
      if (!$action['ignore']) {
        $hook_output = module_invoke_all('ajax_actions_commands', $action, $options);
        $commands = array_merge($commands, $hook_output);
      }
      
      if (end($commands) == 'break') {
        array_pop($commands);
        break;
      }
      
    }
  }
  
  $ajax_link_data = ajax_actions_set_data();
  
  if ($ajax_link_data) {
    $commands[] = array('command' => 'ajax_actions_bulk_data', 'items' => $ajax_link_data);
  }
  
  drupal_alter('ajax_actions_commands', $commands, $options);
  
  ctools_ajax_render($commands);
   * 
   */
}

/**
 * Bring in any necessary include files.
 *
 * @param $options
 *   The post data from the ajax link.
 *
 */

function ajax_actions_includes($options) {
  ctools_include('ajax');
}