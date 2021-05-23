<?php
require_once __DIR__ . '/Controller.php';


class EmmaplasschaertController extends Controller{


  function __construct(){
  }

  public function index(){
    $this->set('title','emmaplasschaert');
  }

  public function intro(){
    $this->set('title','challenge-intro');
  }

  public function game(){
    $this->set('title','challenge ⛵️');
  }


}

?>
