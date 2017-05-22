<?php
//http POST
function login_3D_house($form_data){
    //$url = 'http://localhost/3DHouseServer/index.php';
    //$url = 'http://13.113.93.108/index.php';
	$url = 'http://54.250.173.124/account/index.php';

    $form_data['device'] = 'mobilePhone';
    $form_data['login'] = '登入';

    $options = array(
        'method' => 'POST',
        'header' => 'Content-Type: application/x-www-form-urlencoded',
        'content' => http_build_query($form_data)
    );

    $context = stream_context_create(array('http' => $options));

    return file_get_contents($url, false, $context);
}

function register_3D_house($form_data){
    
	//$url = 'http://localhost/3DHouseServer/register.php';
    $url = 'http://13.113.93.108/register.php';

    $form_data['device'] = 'mobilePhone';
    $form_data['submit'] = '送出';

    $options = array(
        'method' => 'POST',
        'header' => 'Content-Type: application/x-www-form-urlencoded',
        'content' => http_build_query($form_data)
    );

    $context = stream_context_create(array('http' => $options));

    return file_get_contents($url, false, $context);
}

?>