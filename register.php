<?php
session_start();
?>

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
    <script>
        function changelogin(){
            window.location = "login.php";
        }
    </script>
</head>
<body>
    <div class="container">
        <form class="form-signin" method="post" action="testURL_POST2.php">
            <h2 class="form-signin-heading">註冊</h2>
            <div class="login-wrap">
                <input type="text" class="form-control" placeholder="使用者名稱" name="username" maxlength="12" required>
                <input type="text" class="form-control" placeholder="帳號" name="account" maxlength="12" required>
                <input type="password" class="form-control" placeholder="密碼" name="password" maxlength="12" required>
                <input type="password" class="form-control" placeholder="再次確認密碼" name="password2" maxlength="12" required>
                <input type="email" class="form-control" placeholder="信箱" name="email" maxlength="30" required>
                <input type="hidden" class="form-control" placeholder="信箱" name="device">

                <input name="send" type="submit" class="btn btn-lg btn-login btn-block" value="send">
                <input name="cancel" type="button" class="btn btn-lg btn-login btn-block" value="cancel" onclick="changelogin()">
            </div>

        </form>
    </div>


</body>
</html>
