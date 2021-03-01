function poga(){
  let n = parseInt(document.getElementById("n").value);
  //console.log(n);
  let table = document.getElementById("laukums");
  table.innerHTML = '';
  for(let i =0; i< n; i++){
    let row = table.insertRow(i);
    for(let j =0; j< n; j++){
      let button = document.createElement('BUTTON');
      button.classList.add("grid")
      var text = document.createTextNode(i*n+j+1);
      let cell = row.insertCell(j);
      cell.appendChild(button);
    }   
  }
  fitToScreen();

}



window.onload = () => {
  let generatePoga = document.getElementById("generate");
  generatePoga.addEventListener("click", poga);
  fetch("nosaukumi.json")
    .then(response => response.json())
    .then(json => console.log(json))
};

function fitToScreen(){

  let elements = document.getElementsByTagName('td');
  let table = document.getElementById("laukums");

  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
  let width = vw
  let height = vh - table.getBoundingClientRect().top;
  
  let size = Math.floor(Math.min(width, height)/(Math.floor(Math.sqrt(elements.length))+1));
  for(let i=0; i< elements.length; i++){
    elements[i].style.visibility = "visible";
    elements[i].style.width = `${size}px`;
    elements[i].style.height = `${size}px`;
  }
  table.style.width = width;
  table.style.height = height
}

window.addEventListener('resize', fitToScreen);
window.addEventListener('load', fitToScreen);