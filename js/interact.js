var openflag = true;

function MainbtnClick() 
{
    //call animation function
    BtnAnimation(openflag);
    openflag = !openflag;
}


function BtnAnimation(open)
{
    var mainsize = Math.round(GetElement('Main').clientHeight);
    var bottomsize = mainsize/5;
    var btnsize = bottomsize/2;
    var img = GetElement('mainbtnimg');
    if (open) 
    {
        GetStyle('Subaddbtn').bottom = 6*btnsize/4 + "px";
        GetStyle('Subdecoratebtn').right = 6*btnsize/4 + "px";
        img.src = "./images/cross.png";
    }
    else
    {
        GetStyle('Subaddbtn').bottom = GetStyle('Mainbtn').bottom;
        GetStyle('Subdecoratebtn').right = GetStyle('Mainbtn').right;
        img.src = "./images/add.png";
    }
    
}

function SubdecoratebtnClick()
{
    GetStyle('Toolbar').display = "block";
}

function CloseToolbarClick()
{
    openflag = true;
    GetStyle('Toolbar').display = "none";
    GetStyle('Subaddbtn').bottom = GetStyle('Mainbtn').bottom;
    GetStyle('Subdecoratebtn').right = GetStyle('Mainbtn').right;
    GetElement('mainbtnimg').src = "./images/add.png";
}