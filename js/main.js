var countryData;


function generateBestFontSize(text, width){
  let min = 1;
  let max = 100;


  let best = min;
  let lastpivot = -1;
  let pivot = Math.floor((min+max)/2);
  while(lastpivot !== pivot){
    // console.log(pivot);
    if(getTextWidth(text, `${pivot}px arial`) > width){
      max = pivot;
    }else{
      best = Math.max(pivot, best);
      min = pivot;
    }
    lastpivot = pivot;
    pivot = Math.floor((min+max)/2);
  }  
  return best;
}

function getTextWidth(text, font) {
  // re-use canvas object for better performance
  var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
  var context = canvas.getContext("2d");
  context.font = font;
  var metrics = context.measureText(text);
  return metrics.width;
}

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
  let id = 0;
  for(result in pairs){
    content.push({data :`url(svg/${pairs[result][0]}) center no-repeat, #6DB3F2`, id: id});
    //let fontSize = Math.floor(450/pairs[result][1].length);
    let fontSize = generateBestFontSize(`${pairs[result][1]}`, 300)
    content.push({data : `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='300px' width='300px'> \
    <text x='0%' y='60%' fill='black' font-family='arial' font-size='${fontSize}px' >${pairs[result][1]}</text>\
    </svg>") center no-repeat, #6DB3F2`, id: id});
    id++;
  }
  

  //Generate buttons 
  let buttons = new Array();
  let frontDivs = new Array();
  let backDivs = new Array(); 
  for(let i =0; i< n; i++){
    let row = table.insertRow(i);
    for(let j =0; j< n; j++){
      if(i*n+j < content.length){
        let button = document.createElement('BUTTON');
        button.classList.add("grid")
        //button.classList.add('flip-container')
        // let fN =  pairs[i*n+j][0];
        //button.style.background = `url(svg/${fN}) center no-repeat`
        button.style.backgroundSize = 'contain';
        var text = document.createTextNode(i*n+j+1);
        let cell = row.insertCell(j);
        cell.appendChild(button);
        buttons.push(button);
        button.addEventListener('click', function() {
          console.log("Clicked from " + this.id);
        });
        let container = document.createElement('div');
        container.classList.add('flip-container');
        button.appendChild(container);
        // time for divs 
        let mainFlipper = document.createElement('div');
        mainFlipper.classList.add('flipper');
        container.appendChild(mainFlipper);
        // front div
        let front = document.createElement('div');
        front.classList.add('front');
        mainFlipper.appendChild(front);
        frontDivs.push(front);
        // back div
        let back = document.createElement('div');
        back.classList.add('back');
        mainFlipper.appendChild(back);
        backDivs.push(back);


      }
    }   
  }

  let k =0;
  while(content.length>0){
    let data = content.splice(Math.floor(Math.random()*content.length), 1)[0];
    // console.log(data);
    // buttons[k].id = data;
    // buttons[k].data = data.data;
    // console.log(buttons[k]);
    frontDivs[k].style.background = '#6DB3F2';
    frontDivs[k].style.backgroundSize = 'contain';

    backDivs[k].style.background = data.data;
    backDivs[k].style.backgroundSize = 'contain';
    k++;
  }

  fitToScreen();

}



window.onload = () => {
  fetch("nosaukumi.json")
    .then(response => response.json())
    .then((json) => {
      console.log('JSon loaded')
      countryData = json
      let generatePoga = document.getElementById("generate");
      generatePoga.addEventListener("click", poga);
      
      window.addEventListener('resize', fitToScreen);
      window.addEventListener('load', fitToScreen);
    }).catch((err) => alert(err));
};

function fitToScreen(){

  let elements = document.getElementsByTagName('td');
  let laukumsContainer = document.getElementById('laukumsContainer');
  
  let table = document.getElementById("laukums");

  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
  let width = vw
  let height = vh - table.getBoundingClientRect().top;
  
  // let size = Math.floor(Math.min(width, height)/(Math.floor(Math.sqrt(elements.length))+1));
  let size = (Math.min(width, height)/((Math.sqrt(elements.length)+0.5)));
  for(let i=0; i< elements.length; i++){
    //elements[i].style.visibility = "visible";
    let children = elements[i].getElementsByTagName("*");
    for(let i=0; i< children.length; i++){
      let child = children[i];
      child.style.width = `${size}px`
      child.style.height = `${size}px`
    }
    elements[i].style.width = `${size}px`;
    elements[i].style.height = `${size}px`;
    console.log(children);
  }

  let offset = (height-Math.min(width, height))/2;

  laukumsContainer.style.marginTop = `${offset}px`;


  table.style.width = width;
  table.style.height = height
}
