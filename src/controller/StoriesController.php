<?php
require_once __DIR__ . '/Controller.php';


class StoriesController extends Controller{


  function __construct(){
  }

  public function index(){
    $this->set('title','Chatleet');
  }

}

?>
