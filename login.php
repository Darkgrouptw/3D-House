<html lang = "en">
<head>
	<meta charset = "utf-8">
	<meta http-equiv = "X-UA-Compatible" content = "IE=edge">
	<meta name = "viewport" content = "width=device-width, initial-scale=1">
	
	<title>3D House - login</title>
	
	<!-- Bootstrap -->
	<link href = "../Bootstrap/css/bootstrap.min.css" rel = "stylesheet">
	<link href = "../Bootstrap/css/ie10-viewport-bug-workaround.css" rel = "stylesheet">
	<link href = "../Bootstrap/css/login.css" rel = "stylesheet">
	
</head>
<body>
	<div class = "container">
		<form class = "form-signin" method = "post">
			<h2 class = "form-signin-heading" style = "text-align:center">登入頁面</h2>
			<!--<label for="inputEmail" class="sr-only">Email address</label>-->
			<input type="text" id="inputEmail" class="form-control" placeholder="帳號" required="" autofocus="">
			<!--<label for="inputPassword" class="sr-only">Password</label>-->
			<input type="password" id="inputPassword" class="form-control" placeholder="密碼" required="">
			<div class="checkbox">
			  <label>
				<input type="checkbox" value="remember-me"> 記住
			  </label>
			</div>
			<button class="btn btn-lg btn-primary btn-block" type="submit">登入</button>
      </form>
	</div>
</body>
</html>