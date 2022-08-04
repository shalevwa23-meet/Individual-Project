var coll = document.getElementById("add_drawing_button");

coll.addEventListener("click", function() {
    var add_info = this.nextElementSibling;
    if (add_info.style.display === "block") {
      add_info.style.display = "none";
    } else {
      add_info.style.display = "block";
    }
  });


var canvases = document.getElementsByTagName('canvas')

for(let c of canvases)
{
	var ctx = c.getContext("2d");
	c.width = c.dataset.width;
	c.height = c.dataset.height;
	var n = ctx.getImageData(0,0,c.dataset.width,c.dataset.height);
	data_arr = c.dataset.data.split(',')
	n.data.set(data_arr);
	ctx.putImageData(n, 0, 0);
}