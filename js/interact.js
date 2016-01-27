function ExportClick()
{
    GetStyle('ExportContent').display = "block";
}
function CloseExport()
{
    GetStyle('ExportContent').display = "none";
}
var openflag = true;

function MainbtnClick() 
{
    //call animation function
    BtnAnimation(openflag);
    openflag = !openflag;
}


function BtnAnimation(open)
{
    var bottomsize = Math.round(window.innerHeight/6);
    var btnsize = Math.round(bottomsize/2);
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
//Toolbar
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
//SubToolbar
function CloseSubToolbarClick()
{
    GetStyle('SubToolbar').display = "none";
}
function SubToolbarClick(type, index){
    console.log(index);
}
function RoofClick(){
   
    //new element to SubToolbar dynamically
    var AddElem = function(index, MajorElem , BeforeElem)
    {
        var E = document.createElement("li");
        var context = document.createTextNode("Roof" + index.toString());
        E.id = "Roof" + index.toString();
        E.onclick = function() {SubToolbarClick(2,index)};
        E.appendChild(context);
        
        MajorElem.insertBefore(E, BeforeElem);
    }
    var totalroof = 3;
    var content = GetElement('SubToolbarContent');
    var insertElement = GetElement('SubToolbarClose');
    
    for (var i = 1; i <= 3; i++)
    {
        AddElem(i,content,insertElement);
    }
        GetStyle('SubToolbar').display = "block";
    
}