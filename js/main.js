var countryData;

function generatePairs(n){
  let arr = new Array();
  for (const key in countryData){
    arr.push([key, countryData[key]]);
  }
  let resultArr = new Array();
  for(let i=0; i < n; i++){
    resultArr = resultArr.concat(arr.splice(Math.floor(Math.random()*arr.length), 1))
  }
  return resultArr;
}


function poga(){
  
  let n = parseInt(document.getElementById("n").value); // Gets inputed grid size
  let table = document.getElementById("laukums"); // Gets the table
  table.innerHTML = ''; // Clears the table of old content
  let pairs = generatePairs((n*n-(n%2))/2); // Generate pairs of flags and names

  // Transforms flags and names into viewable content
  let content = new Array();
  for(result in pairs){
    content.push(`url(svg/${pairs[result][0]}) center no-repeat`);
    content.push(`url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='200px'> \
    <foreignObject x="0" y="0" width="200" height="50"> \
    <p xmlns="http://www.w3.org/1999/xhtml">${pairs[result][1]}</p> \
    </foreignObject> \
    </svg>") center no-repeat`);
  }
  console.log(content);
  

  //Generate buttons 
  let buttons = new Array(); 
  for(let i =0; i< n; i++){
    let row = table.insertRow(i);
    for(let j =0; j< n; j++){
      let button = document.createElement('BUTTON');
      button.classList.add("grid")
      //button.style.background = `url(svg/${fN}) center no-repeat`
      button.style.backgroundSize = 'contain';
      var text = document.createTextNode(i*n+j+1);
      let cell = row.insertCell(j);
      cell.appendChild(button);
      buttons.push(button);
    }   
  }

  fitToScreen();

  /*let k =0;
  while(content.length > 0){
    buttons[k].style.background = content.splice(Math.floor(Math.random()* content.length), 1);
    buttons[k].style.backgroundSize = 'contain';
    k++
  }*/

}



window.onload = () => {
  let generatePoga = document.getElementById("generate");
  generatePoga.addEventListener("click", poga);
  fetch("nosaukumi.json")
    .then(response => response.json())
    .then(json => countryData = json)
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
    //elements[i].style.visibility = "visible";
    elements[i].style.width = `${size}px`;
    elements[i].style.height = `${size}px`;
  }

  table.style.width = width;
  table.style.height = height
}

window.addEventListener('resize', fitToScreen);
window.addEventListener('load', fitToScreen);