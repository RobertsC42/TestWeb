// Stores country data from the json
var countryData;
// Each button has custom data, that unfortunately couldn't have been added to this
var buttonData;
// Current stack of buttons
var buttonStack;
// Score
var solved;
// Required score
var required;


//Finds the best font for text to fit width
function generateBestFontSize(text, width){
  let min = 1;
  let max = 100;


  let best = min;
  let lastpivot = -1;
  let pivot = Math.floor((min+max)/2);
  while(lastpivot !== pivot){
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


//Find the text width of text
function getTextWidth(text, font) {
  // re-use canvas object for better performance
  var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
  var context = canvas.getContext("2d");
  context.font = font;
  var metrics = context.measureText(text);
  return metrics.width;
}


// Generates the pairs of country names and flags
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



// The function that is executed upon generate play area

function removeClicked(element){
  element.getElementsByClassName('flipper')[0].classList.remove('clicked');
}


function win(){
  confetti.start();
  alert('good job you won')
}


function poga(){
  confetti.stop();
  let n = parseInt(document.getElementById("n").value); // Gets inputted grid size
  let table = document.getElementById("laukums"); // Gets the table
  table.innerHTML = ''; // Clears the table of old content
  let pairs = generatePairs((n*n-(n%2))/2); // Generate pairs of flags and names

  // Transforms flags and names into viewable content
  let content = new Array();
  let id = 0;
  for(result in pairs){
    content.push({data :`url(svg/${pairs[result][0]}) center no-repeat, #6DB3F2`, id: id, open:false});
    let fontSize = generateBestFontSize(`${pairs[result][1]}`, 300)
    content.push({data : `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='300px' width='300px'> \
    <text x='0%' y='60%' fill='black' font-family='arial' font-size='${fontSize}px' >${pairs[result][1]}</text>\
    </svg>") center no-repeat, #6DB3F2`, id: id, open:false});
    id++;
  }
  

  // Temporarily stores the buttons frontDivs and backDivs
  let buttons = new Array();
  let frontDivs = new Array();
  let backDivs = new Array(); 

  //Gets the required points
  required = content.length;

  //Generates button grid
  for(let i =0; i< n; i++){
    let row = table.insertRow(i);
    for(let j =0; j< n; j++){
      if(i*n+j < content.length){
        let button = document.createElement('BUTTON');
        button.classList.add("grid")
        let cell = row.insertCell(j);
        cell.appendChild(button);
        buttons.push(button);

        // Main function that happens upon button press
        button.addEventListener('click', function() {
          let flipper = this.getElementsByClassName('flipper')[0];
          if(buttonData[this.id].clickable){
            // console.log("its clickable")
            if(buttonData[this.id].open === false){
              // console.log('yep this is true');
              if(buttonStack.length == 2){
                // console.log("time to remove from stack")
                if(buttonData[buttonStack[0]].id == buttonData[buttonStack[1]].id){
                  // console.log("yep it was solved");
                  solved+=2;
                  buttonData[buttonStack[1]].clickable = false;
                  buttonData[buttonStack[0]].clickable = false;
                  // console.log(required);
                  // console.log(solved);
                  // console.log('this')

                }else{
                  // console.log("nope it was not solved")
                  removeClicked(document.getElementById(buttonStack[0]))
                  removeClicked(document.getElementById(buttonStack[1]))
                }
                buttonData[buttonStack[0]].open = false;
                buttonData[buttonStack[1]].open = false;
                buttonStack = [];

              
              }
              
              buttonData[this.id].open = true;
              buttonStack.push(this.id)
              flipper.classList.add('clicked');

              if(buttonStack.length== 2 && solved+2 === required && (buttonData[buttonStack[0]].id === buttonData[buttonStack[1]].id)){
                win();
              }

            }
          }
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
  // Adds data to buttonData and also add text and drawing to backDivs
  let k =0;
  buttonData = {};
  buttonStack = [];
  solved = 0;
  while(content.length>0){
    let data = content.splice(Math.floor(Math.random()*content.length), 1)[0];
    data.clickable = true;
    buttons[k].id = k;
    //Add data
    buttonData[k] = data;
    // buttons[k].data = data.data;
    frontDivs[k].style.background = '#6DB3F2';
    frontDivs[k].style.backgroundSize = 'contain';

    backDivs[k].style.background = data.data;
    backDivs[k].style.backgroundSize = 'contain';
    k++;
  }
  // Resizes the grid to fit to screen
  fitToScreen();

}


// Function that executes upon window load
window.onload = () => {
  // Loads the json file that contain country data
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


// Function that ensures that the grid fits to screen
function fitToScreen(){

  let elements = document.getElementsByTagName('td');
  let laukumsContainer = document.getElementById('laukumsContainer');
  
  let table = document.getElementById("laukums");

  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
  let width = vw
  let height = vh - table.getBoundingClientRect().top;
  // Calculate the size of each button in the grid, and applies it to each child and button
  let size = (Math.min(width, height)/((Math.sqrt(elements.length)+0.5)));
  for(let i=0; i< elements.length; i++){
    let children = elements[i].getElementsByTagName("*");
    for(let i=0; i< children.length; i++){
      let child = children[i];
      child.style.width = `${size}px`
      child.style.height = `${size}px`
    }
    elements[i].style.width = `${size}px`;
    elements[i].style.height = `${size}px`;
  }
  // Calculates and puts the needed offset from top for the grid
  let offset = (height-Math.min(width, height))/2;

  laukumsContainer.style.marginTop = `${offset}px`;


  table.style.width = width;
  table.style.height = height
}
