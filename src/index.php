<?php
  session_start();
  ini_set('display_errors',true);
  error_reporting(E_ALL);

  $routes = array(
    'home' => array(
      'controller' => 'Stories',
      'action' => 'index'
    ),
    'landing' => array(
      'controller' => 'Landing',
      'action' => 'index'
    ),
    'emmaplasschaert' => array(
      'controller' => 'Emmaplasschaert',
      'action' => 'index'
    ),
    'introzeilen' => array(
      'controller' => 'Emmaplasschaert',
      'action' => 'intro'
    ),
    'gamezeilen' => array(
      'controller' => 'Emmaplasschaert',
      'action' => 'game'
    ),
    'joliendhoore' => array(
      'controller' => 'Joliendhoore',
      'action' => 'index'
    ),
    'introfietsen' => array(
      'controller' => 'Joliendhoore',
      'action' => 'intro'
    ),
    'gamefietsen' => array(
      'controller' => 'Joliendhoore',
      'action' => 'game'
    ));
  if(empty($_GET['page'])){
    $_GET['page'] = 'home';
  }
  if(empty($routes[$_GET['page']])){
    header('Location: index.php');
    exit();
  }
  $route = $routes[$_GET['page']];
  $controllerName = $route['controller'] . 'Controller';

  require_once __DIR__ . '/controller/' . $controllerName . '.php';

  $controllerObj = new $controllerName();
  $controllerObj->route = $route;
  $controllerObj->filter();
  $controllerObj->render();

