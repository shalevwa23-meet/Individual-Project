var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

var prev = document.getElementsByClassName('prev');
if(prev.length>0)
{
	var c = prev[0];
	var ctx = c.getContext("2d");
	c.width = c.dataset.width;
	c.height = c.dataset.height;
	var n = ctx.getImageData(0,0,c.dataset.width,c.dataset.height);
	data_arr = c.dataset.data.split(',')
	n.data.set(data_arr);
	ctx.putImageData(n, 0, 0);
}

var is_drawing = false;

var saved =[ctx.getImageData(0,0,canvas.width, canvas.height)];

var cur_img = 0;

var pic_info  = new FormData();



function undo()
{
	if(cur_img >= 0)
	{
		console.log(cur_img)
		console.log(saved)
		console.log(saved[cur_img-1])
		// console.log(saved[cur_img-1].data);
		ctx.putImageData(saved[cur_img-1], 0, 0);
		cur_img--;
		// console.log(ctx.getImageData(0, 0, canvas.width, canvas.height).data);
	}
}

function redo()
{

	if(cur_img < saved.length-1)
	{
		// console.log(saved[cur_img-1].data);
		ctx.putImageData(saved[cur_img+1], 0, 0);
		cur_img++;
		// console.log(ctx.getImageData(0, 0, canvas.width, canvas.height).data);
	}
}

function save()
{
	img = ctx.getImageData(0, 0, canvas.width, canvas.height);
	if(cur_img < saved.length-1)
	{
		saved.splice(cur_img+1)
	}

	saved.push(img);
	
	cur_img++;
	if(saved.length > 100)
	{
		cur_img--;
		saved.splice(0,1)
	}
	


}

document.getElementById('save').addEventListener("click", function(){
	save();
	pic_info.set('data', saved[cur_img].data);
	// alert(saved[cur_img].data.length)
	pic_info.set('height', saved[cur_img].height);
	pic_info.set('width',saved[cur_img].width);
	const XHR = new XMLHttpRequest();
	XHR.open('POST', window.location.href);
	XHR.send(pic_info);
})



document.getElementById('size').addEventListener("change", function(){

	if(document.getElementById(color).value=='')
	{
		document.getElementById(color).value=0;
	}
})

document.getElementById('size').addEventListener("input", function(){

	var size = parseInt(document.getElementById('size').value)


	document.getElementById('size_example').style.height = size+'px';
	ctx.lineWidth = size;

})

for(let color of ['R','G','B']){
document.getElementById(color).addEventListener("change", function(){

	if(document.getElementById(color).value=='')
	{
		document.getElementById(color).value=0;
	}
})
document.getElementById(color).addEventListener("input", function(){

	var r = parseInt(document.getElementById('R').value)
	var g = parseInt(document.getElementById('G').value)
	var b = parseInt(document.getElementById('B').value)

	document.getElementById('color_example').style.backgroundColor = "rgb("+r+","+g+","+b+")";
	ctx.strokeStyle = "rgb("+r+","+g+","+b+")";

})
}
canvas.addEventListener("mousemove", function(event){

	if(is_drawing)
	{
		ctx.lineTo(event.clientX-canvas.getBoundingClientRect().left, event.clientY-canvas.getBoundingClientRect().top);
		ctx.stroke()
	}

})

canvas.addEventListener("mousedown", function(event){

	is_drawing = true;
	ctx.moveTo(event.clientX-canvas.getBoundingClientRect().left, event.clientY-canvas.getBoundingClientRect().top);
	ctx.beginPath()

})

canvas.addEventListener("mouseup", function(event){

	is_drawing = false;
	save()

})