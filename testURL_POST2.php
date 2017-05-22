<?php  
    session_start();
	require './account_API.php';
	if($_POST['send'] == 'send')
	{  
		$form_data = array
		(
			'username' => $_POST['username'],
			'account' => $_POST['account'],
			'password' => $_POST['password'],
			'password2' => $_POST['password2'],
			'email' => $_POST['email']
		);
		//echo json_encode($form_data);
		
		$result = register_3D_house($form_data);
		//var_dump($result);
		
		if(strpos($result, 'failed'))
		{
			$_SESSION['error']="註冊失敗!";
	
			header('Location: '.'register.php');
		}
		else
		{
			header('Location: '.'login.php');
		}
		
	}
?>

