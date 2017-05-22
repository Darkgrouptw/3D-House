<?php
	require './account_API.php';
	if($_POST['login'] == 'login')
	{  
		$form_data = array
		(
			'account'  => $_POST['account'],
			'password' => $_POST['password']
		);
		//echo json_encode($form_data);
		
		
		$result = login_3D_house($form_data);
		//print_r($result);
			
		if(strpos($result, 'failed'))
		{
			//echo "failed";
			header('Location: '.'login.php');
		}
		else
		{
			//(紀錄username跟account) 
			$account = json_decode($result)->messages->account;
			$username = json_decode($result)->messages->username;
			
			session_start();
			
			$_SESSION['account']=$account;
			$_SESSION['username']=$username;
			
			header('Location: '.'draw.php?XML=demo');
		}
		
	}
?>