//This is for animation

function FuncBarClick(ClickAreaClassName, OtherAreaClassName)
{
	Func_click_flag = !Func_click_flag;
	var ClickArea = getElemByClass(ClickAreaClassName);
	var Text = ClickAreaClassName.split(" ")[1];
	var ClickText = getElem(Text);
	var AnotherArea = getElemByClass(OtherAreaClassName);
	var close = getStyle(ClickAreaClassName.split(" ")[1] + "_close");

	if(Func_click_flag)//open
	{
		Modal.display = "block";
		expansion_animation(ClickAreaClassName+" invisible",1);
		ClickText.innerHTML = "X";
		close.backgroundColor = "rgba(171,165,165,0.6)";
		for (var i = 0;i < AnotherArea.length;i++)
		{
			AnotherArea[i].style.display = "none";
		}
	}
	else//close
	{
		Modal.display = "none";
		expansion_animation(ClickAreaClassName+" invisible",0);
		ClickText.innerHTML = Text;
		close.backgroundColor = "rgba(34,167,240,0.6)";
		AnotherArea[AnotherArea.length-1].style.display = "block";
		Func_click_flag = 0;
	}
}

function expansion_animation(ClassName,direction)
{
	var Square = getElemByClass(ClassName);
	var w = parseInt(Square[0].style.width);
	w = 1.025*w;
	if(w%4!=0)
		w = w - ((w-Math.floor(w/100))%4) +16;
	for(var i = 0;i<Square.length;i++)
	{
		Square[i].style.display = "block";
		move(Square[i],direction,(i+1)*w,i+1);
	}
}

function move(Elem,direction,dest,n)
{
	var pos = 0;
	var id = setInterval(frame,n);
	
	function frame(){
		if(direction)
		{
			if(pos >= dest)
				clearInterval(id);
			else
			{
				pos+=4;
				Elem.style.right = pos + 'px';
			}
		}
		else
		{
			if(pos >= dest)
				clearInterval(id);
			else
			{
				pos+=4;
				Elem.style.right = parseInt(Elem.style.right) - pos + 'px';
			}
		}
	}
}