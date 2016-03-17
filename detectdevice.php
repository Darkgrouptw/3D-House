<?php
$Mobile = checkdevice($_SERVER['HTTP_USER_AGENT']);
function check($v)
{
	if(gettype($v)=="boolean")
		$v = FALSE;
	else
	{
		$v = TRUE;
	}
	return $v;
}

function checkdevice($ua)
{
	$android = check(stripos($ua, "Android")); 
	$blackberry = check(stripos($ua, "BlackBerry"));
	$iphone = check(stripos($ua, "iPhone")); 
	$palm = check(stripos($ua, "Palm"));
	if($android==TRUE || $blackberry==TRUE || $iphone==TRUE || $palm==TRUE)
		$Mobile = 1;
	else 
		$Mobile = 0;
	
	return $Mobile;
}

?>