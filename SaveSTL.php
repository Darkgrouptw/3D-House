<?php
    $DebugMode = true;
    if($DebugMode)
        if(count($_POST) != 0)
            file_put_contents($_POST["name"].".stl",$_POST["stl"]);
        else
           echo "No post params";
?>