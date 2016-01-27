function setlayout(){
    //get the bottom height to dynamic change other element size
    var bottomsize = Math.round(window.innerHeight/6);
    var btnsize = Math.round(bottomsize/2);
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
    //Toptoolbar
    changesize(GetElement('Top'), -1, btnsize/1.5); 
    //change the toptoolbar <i> size
    var CSSSTYLE = document.createElement("STYLE");
    var toptoolbarsize = btnsize/1.5;
    var isize = document.createTextNode(".top.bar i {height:" + toptoolbarsize/2 + "px;  margin-top:" + toptoolbarsize/4 + "px;  font-size:" + toptoolbarsize/2 + "px;}");
    CSSSTYLE.appendChild(isize);
    document.head.appendChild(CSSSTYLE);
    GetStyle('ExportContent').top = toptoolbarsize + "px";
    //MainCanvas
    changesize(GetElement('archcanvas'),window.innerWidth,window.innerHeight);
    //change tool bar 
    changesize(GetElement('Toolbar'), -1, bottomsize);
    changesize(GetElement('SubToolbar'), -1, bottomsize);
    GetStyle('SubToolbar').bottom = bottomsize + "px";
    //change the toolbar imgsize
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