<html>
	<head>
		<title>3D House-login</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <!-- Bootstrap core CSS -->
        <link href="css/login/bootstrap.min.css" rel="stylesheet">
        <link href="css/login/bootstrap-reset.css" rel="stylesheet">
        <!-- Custom styles for this template -->
        <link href="css/login/style1.css" rel="stylesheet">
        <link href="css/login/style-responsive.css" rel="stylesheet" />
	</head>
	<body>
        <div class="container">
            <form class="form-signin" method="post" action="testURL_POST.php">
                <h2 class="form-signin-heading">sign in now</h2>
                <div class="login-wrap">
                    <input type="text" class="form-control" placeholder="帳號" name="account" required>
                    <input type="password" class="form-control" placeholder="密碼" name="password" required>      
                    <span class="pull-right"> <a href="register.php">註冊資料</a></span>
					<input type="hidden" name="device">
                    <input name="login" type="submit" class="btn btn-lg btn-login btn-block" value="login">
                </div>

            </form>
        </div>
	</body>
</html>
