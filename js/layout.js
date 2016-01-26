function setlayout(){
    //get the bottom height to dynamic change other element size
    var mainsize = Math.round(GetElement('Main').clientHeight);
    var bottomsize = mainsize/6;
    var btnsize = bottomsize/2;
    //change button
    var RoutinProcess = function(E) 
    { 
        var T = GetElement(E);
        changesize(T, btnsize, btnsize);
        T.style.bottom = btnsize/4 + "px";
        T.style.right = T.style.bottom;
    }
    
    RoutinProcess('Mainbtn');
    RoutinProcess('Subaddbtn');
    RoutinProcess('Subdecoratebtn');
    
    //change canvas
    changesize(GetElement('Top'), -1, btnsize/1.5);
    changesize(GetElement('Main'),-1,mainsize);
    changesize(GetElement('archcanvas'),window.innerWidth,mainsize);
    //change tool bar 
    changesize(GetElement('Toolbar'), -1, bottomsize);

   
    //change the toolbar imgsize
    var CSSSTYLE = document.createElement("STYLE");
    var liimg = document.createTextNode(".bottom.bar img {height: " + bottomsize/2 +"px;  margin-top:" + bottomsize/4 + "px;}");
    CSSSTYLE.appendChild(liimg);
    document.head.appendChild(CSSSTYLE);
}

function changesize(element, width, height){
    if (width != -1){
        element.style.width = width + "px";
        element.style.height = height + "px";   
    }
    else
        element.style.height = height + "px";
}