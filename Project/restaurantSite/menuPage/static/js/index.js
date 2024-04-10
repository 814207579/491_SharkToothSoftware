function changeAmongusSize() {
   let amongus = document.getElementById("amongus");
   amongus.width = Math.random()*2000;
   amongus.height = Math.random()*2000;
}

setInterval(changeAmongusSize, 10)