let audio;
const tabla = document.querySelector("table");
let notes = Array.prototype.slice.call(document.querySelectorAll("td"));
const audios = Array.prototype.slice.call(document.querySelectorAll("audio"));

const chromaticKeyValues = {
  "|": [0, "72.8%", "natural-note"],        // E
  Tab: [1, "70.2%", "natural-note"],
  CapsLock: [2, "67.73%", "flat-note"],
  "<": [3, "67.73%", "natural-note"],
  1: [4, "65%", "flat-note"],
  q: [5, "65%", "natural-note"],
  a: [6, "63%", "flat-note"],
  z: [7, "62.5%", "natural-note"],          // B
  2: [8, "60%", "natural-note"],            // C
  w: [9, "57.4%", "flat-note"],
  s: [10, "57.4%", "natural-note"],
  x: [11, "55.6%", "flat-note"],
  3: [12, "55.6%", "natural-note"],
  e: [13, "53%", "natural-note"],
  d: [14, "50.45%", "flat-note"],
  c: [15, "50.45%", "natural-note"],
  4: [16, "48%", "flat-note"],
  r: [17, "48%", "natural-note"],
  f: [18, "45.3%", "flat-note"],
  v: [19, "45.3%", "natural-note"],         // B
  5: [20, "43%", "natural-note"],           // C
  t: [21, "40.4%", "flat-note"],
  g: [22, "40.4%", "natural-note"],
  b: [23, "37.8%", "flat-note"],
  6: [24, "37.8%", "natural-note"],
  y: [25, "35.4%", "natural-note"],
  h: [26, "33%", "flat-note"],
  n: [27, "33%", "natural-note"],
  7: [28, "30.25%", "flat-note"],
  u: [29, "30.25%", "natural-note"],
  j: [30, "27.9%", "flat-note"],
  m: [31, "27.9%", "natural-note"],          // B
  8: [32, "25.45%", "natural-note"],         // C
  i: [33, "22.85%", "flat-note"],
  k: [34, "22.85%", "natural-note"],
  ",": [35, "20.25%", "flat-note"],
  9: [36, "20.25%", "natural-note"],
  o: [37, "17.8%", "natural-note"],
  l: [38, "15.3%", "flat-note"],
  ".": [39, "15.3%", "natural-note"],
  0: [40, "12.7%", "flat-note"],
  p: [41, "12.7%", "natural-note"],
  ñ: [42, "10.2%", "flat-note"],
  "-": [43, "10.2%", "natural-note"],
};

const keyValues = Object.keys(chromaticKeyValues);

let pressed = Array(keyValues.length).fill(0);

const pentagrama = document.querySelector("#pentagram");
let backupPentagram = Array.prototype.slice.call(pentagrama.cloneNode(true).children);
let noteShiftCounter = 0;

// Sort notes based on their posicion property
function sortByPitch(a, b) {
  a = parseInt(a.dataset.posicion);
  b = parseInt(b.dataset.posicion);
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
}
notes = notes.sort(sortByPitch);

// Lower volume of audio files
audios.forEach((e) => (e.volume = 0.5));

// Function to reset the musical pentagram
function resetPentagram() {
  Array.prototype.slice.call(pentagrama.children).forEach((e) => e.remove());
  pentagrama.style.width = "25vw";
  backupPentagram.forEach((e) => pentagrama.appendChild(e));
  noteShiftCounter = 0;
  // Reset copy
  backupPentagram = Array.prototype.slice.call(pentagrama.cloneNode(true).children);
}

// Timing of notes pressed
initialKeypressTime = Date.now();
keypressTimes = [0];

// Variable for avoiding keydown trigger after keyup is triggered
let keydownTriggered = {};

// Play sound after appropriate key press and change color
document.body.addEventListener(
  "keydown",
  function (e) {
    tempo = String(e.key);
    if (keyValues.includes(tempo)) {
      
      if (e.repeat) { return; }
      
      if (!keydownTriggered[e.key]) {
        // Set key pressed as trigerred
        keydownTriggered[e.key] = true;
        
        audio = audios[chromaticKeyValues[tempo][0]];
        audio.currentTime = 0;
        audio.play();
        notes[chromaticKeyValues[tempo][0]].style.background = "white";
        
        keypressTimes.push(Date.now() - initialKeypressTime);
        
        if (keypressTimes.at(-1) - keypressTimes.at(-2) > 100) {
          noteShiftCounter += 1;
        }
        
        let nota = document.createElement("div");
        nota.className = chromaticKeyValues[tempo][2];
        nota.style.top = chromaticKeyValues[tempo][1];
        // Set horizontal distance between consecutive (non simultaneous) notes
        nota.style.left = String(12 * noteShiftCounter) + "%"; 

        pentagrama.prepend(nota);
        pentagrama.firstChild.scrollIntoView();
        
        // Increase length of pentragram lines due to overflow
        let currentPentagramWidth = String(pentagrama.scrollWidth);
        let potentialNewLines = 
        Array.prototype.slice.call(document.querySelectorAll('hr[class*="linea"]'));
        // Remove hidden line
        potentialNewLines.shift();
        
        potentialNewLines.forEach( (linea) => {
          linea.style.width =  currentPentagramWidth + 'px';
          //   linea.style.width = String(lineas[0].getBoundingClientRect().width + 28)+'px';
        })
      }
    }
  }
)

document.body.addEventListener(
  "keyup", 
  function (e) {
    tempo = String(e.key);
    if (keyValues.includes(tempo)) {
      // Reset key pressed's trigger
      keydownTriggered[e.key] = false;
      
      // Reset note color
      notes[chromaticKeyValues[tempo][0]].style.backgroundColor =
        "rgb(119, 116, 116)";
      notes[chromaticKeyValues[tempo][0]].style.backgroundImage =
        "radial-gradient(rgb(112, 201, 237) 20%,rgb(119, 116, 116))";
    }
  }
)

// Change volume of notes
document.querySelector("#volume-control").addEventListener(
  "change",
  function (event) {
    audios.forEach((e) => (e.volume = event.target.value));
  }
)

// Functions for automatization with Python or JavaScript
let t_0; // initial arbitrary time
let tracking = {}; // dictionary for times and notes
let teclas, tiempos, posicionesPlayed, notesPlayed;

function restartRecording() {
  t_0 = Date.now();
  tracking = {};
  document.body.addEventListener(
    "keydown",
    (event) => {
      if (event.repeat) { return; }
      tracking[Date.now() - t_0] = event.key
    }
  )
}

function getTimesAndNotes() {
  // tiempos variable for Python
  tiempos = Object.keys(tracking).map((e) => parseInt(e));
  console.log(JSON.stringify(tiempos));

  // teclas variable for Python
  teclas = Object.values(tracking);
  console.log(JSON.stringify(teclas));

  // Note positions played during recording
  posicionesPlayed = [];
  teclas.forEach((tecla) =>
    posicionesPlayed.push(chromaticKeyValues[tecla][0])
  );
  console.log(JSON.stringify(posicionesPlayed));

  // Actual note classes played during recording
  notesPlayed = [];
  posicionesPlayed.forEach((nota) =>
    notesPlayed.push(
      notes
        .slice(0, 12)
        .filter((e) => parseInt(e.dataset.posicion) === nota % 12)[0].innerHTML
    )
  );
  console.log(JSON.stringify(notesPlayed));
};

async function playRecording() {
  // Get times between notes
  let jsTeclas = teclas;
  let jsTimes = tiempos;
  jsTimes = jsTimes.slice(1).map(function(n, i) { return n - jsTimes[i]; })

  // Add arbitrary final end time to last note played
  jsTimes.push(1500);
  console.log(jsTimes);
  
  // Start note playing simulation
  for (let i=0; i<jsTeclas.length; i++) {
    document.body.dispatchEvent(
      new KeyboardEvent('keydown', {'key':jsTeclas[i]} )
    )
    await sleep(jsTimes[i]);
    document.body.dispatchEvent(
      new KeyboardEvent('keyup', {'key':jsTeclas[i]} )
    )
  }
}

function sleep(miliseconds) {
  return new Promise(resolve => setTimeout(resolve, miliseconds));
}