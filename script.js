let audio;
const tabla = document.querySelector("table");
let notes = Array.prototype.slice.call(document.querySelectorAll("td"));
const audios = Array.prototype.slice.call(document.querySelectorAll("audio"));

const chromaticKeyValues = {
  "|": [0, 27, "natural-note"],        // E
  "Tab": [1, 26, "natural-note"],
  "CapsLock": [2, 25 , "flat-note"],
  "<": [3, 25 , "natural-note"],
  "1": [4, 24 , "flat-note"],
  "q": [5, 24 , "natural-note"],
  "a": [6, 23 , "flat-note"],
  "z": [7, 23 , "natural-note"],          // B
  "2": [8, 22 , "natural-note"],            // C
  "w": [9, 21 , "flat-note"],
  "s": [10, 21 , "natural-note"],
  "x": [11, 20 , "flat-note"],
  "3": [12, 20 , "natural-note"],
  "e": [13, 19 , "natural-note"],
  "d": [14, 18 , "flat-note"],
  "c": [15, 18 , "natural-note"],       // G4
  "4": [16, 17 , "flat-note"],
  "r": [17, 17 , "natural-note"],
  "f": [18, 16 , "flat-note"],
  "v": [19, 16 , "natural-note"],         // B
  "5": [20, 15 , "natural-note"],           // C  
  "t": [21, 14 , "flat-note"],
  "g": [22, 14 , "natural-note"],
  "b": [23, 13 , "flat-note"],
  "6": [24, 13 , "natural-note"],
  "y": [25, 12 , "natural-note"],
  "h": [26, 11 , "flat-note"],
  "n": [27, 11 , "natural-note"],
  "7": [28, 10 , "flat-note"],
  "u": [29, 10 , "natural-note"],
  "j": [30, 9 , "flat-note"],
  "m": [31, 9 , "natural-note"],          // B
  "8": [32, 8 , "natural-note"],         // C
  "i": [33, 7 , "flat-note"],
  "k": [34, 7 , "natural-note"],
  ",": [35, 6 , "flat-note"],
  "9": [36, 6 , "natural-note"],
  "o": [37, 5 , "natural-note"],
  "l": [38, 4 , "flat-note"],
  ".": [39, 4 , "natural-note"],
  "0": [40, 3 , "flat-note"],
  "p": [41, 3 , "natural-note"],
  "ñ": [42, 2 , "flat-note"],
  "-": [43, 2 , "natural-note"],
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

// Set a margin of error of how close, timewise,
// consecutive notes must be played fot they
// to be considered as a chord
let keypressMarginOfError = 100;

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

        // Deal with problematic keys
        if (e.key === "Tab" || e.key === "CapsLock") {
          e.preventDefault();
        }
        
        audio = audios[chromaticKeyValues[tempo][0]];
        audio.currentTime = 0;
        audio.play();
        notes[chromaticKeyValues[tempo][0]].style.background = "white";
        
        keypressTimes.push(Date.now() - initialKeypressTime);
        
        if (keypressTimes.at(-1) - keypressTimes.at(-2) > keypressMarginOfError) {
          noteShiftCounter += 1;
        }
        
        let nota = document.createElement("div");
        nota.className = chromaticKeyValues[tempo][2];
        nota.style.top = 
          String(
            document.querySelector("#rows")
            .children[chromaticKeyValues[tempo][1]].offsetTop - 7
          ) + "px";
        // Set horizontal distance between consecutive (non simultaneous) notes
        nota.style.left = String(12 * noteShiftCounter) + "%"; 

        pentagrama.prepend(nota);
        pentagrama.firstChild.scrollIntoView();
        
        // Increase length of pentragram lines due to overflow
        let currentPentagramWidth = String(pentagrama.parentNode.scrollWidth);
        let potentialNewLines = 
          Array.prototype.slice.call(
            document.querySelectorAll('hr[class*="linea"]')
          )
        potentialNewLines.forEach( (linea) => {
          linea.style.width =  currentPentagramWidth + 'px';
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
      notes[chromaticKeyValues[tempo][0]]
        .style.backgroundColor = "rgb(119, 116, 116)";
      notes[chromaticKeyValues[tempo][0]]
        .style.backgroundImage = "radial-gradient(rgb(112, 201, 237) 20%,rgb(119, 116, 116))";
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

// Provide template mini song 
tiempos = [1140,1804,1881,1923,1996,3323,3998,4004,4016,5432,5892,5953,6004,6055,6121,7418,7966,8026,8088,8094,8101,8400,8747,9869,10382,10421,10495,10567,11771,12374,12418,12510,13079,13430,13713,14020,14046,14534,14898,15334,15803,15923,16082,16196,16393,17453,17773,18228,18398,18529,18653,18874,20297,20321,20369,21040,21391,21742,22268,22275,22287,22350,22413,22850,23409,24209,24521,24549,24657,24689,25607,26091,26436,26470,26533,26588,27290,27693,27727,27798,27860,28153,28816,28874,28907,28953,31229,31274,31328,31370,31879,31950,31972,32030,32596,32664,32715,32729,33350,33397,33437,33496]
teclas = ["k","e","f","b","o","k","b","r","y","k","e","f","b","n","o","k","r","y","i","b","o","0","o","i","f","t","y","8","h","f","t","n","8","8","j","7","8","i","8","j","x","d","f","t","y","t","b","1","x","d","r","y","1","d","v","y","7","j","a","4","6","g","m","i","j","j","x","4","y","i","c","j","x","d","f","t","1","x","d","r","6","b","w","e","f","t","r","t","n","u","4","5","h","j","c","v","n","y","d","f","6","7"]

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

let pausePlayRecordingFunction = false;
function pauseRecording () {
  pausePlayRecordingFunction = true;
}

let chordsPseudoCounter = 0;
async function playRecording() {
  // Reset stop of function (fixes bug
  // where playRecording needed to be
  // called twice in order to activate)
  pausePlayRecordingFunction = false;
  
  // Get times between notes
  let jsTeclas = teclas;
  let jsTimes = tiempos;
  jsTimes = jsTimes.slice(1).map(function(n, i) { return n - jsTimes[i]; })

  // Add arbitrary final end time to last note played
  jsTimes.push(1500);
  console.log(jsTimes);

  // Get time scaling factor picked by user
  let playbackSpeed = document.querySelector("#playback-speed").value;
  
  // Start note playing simulation
  let i = Math.round((jsTeclas.length - 1) * parseInt(progress.value) * 0.01);

  for (i; i < jsTeclas.length; i++) {
    if (pausePlayRecordingFunction === true) {
      pausePlayRecordingFunction = false;
      return ;
    } else {
      // Play note
      document.body.dispatchEvent(
        new KeyboardEvent('keydown', {'key':jsTeclas[i]} )
      )

      let percentagePlayed = 
      Math.round((i+1) * 100 / jsTeclas.length);
      progress.value = percentagePlayed;
      progress.nextElementSibling.innerText =
      String(percentagePlayed) + '%';

      await sleep(jsTimes[i] / playbackSpeed);

      // Semi release key only if the next note
      // occurs late enough
      if (jsTimes[i] < keypressMarginOfError) {
        chordsPseudoCounter += 1;
      } else {
        if (pausePlayRecordingFunction === true) {
          pausePlayRecordingFunction = false;
          return ;
        } else {
          range(i - chordsPseudoCounter, i).forEach(position => {
            document.body.dispatchEvent(
              new KeyboardEvent('keyup', {'key':jsTeclas[position]} )
            )
          })
          chordsPseudoCounter = 0;
        }
      }
    }
  }
}

function sleep(miliseconds) {
  return new Promise(resolve => setTimeout(resolve, miliseconds));
}

function range(start, end) {
  return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

// Keyboard commands for some functions
document.addEventListener(
  'keydown', 
  function (event) {
    if (event.repeat) { return; }

    if (event.key === "Backspace") {
      resetPentagram();
      keyValues.forEach(someKey => {
        document.body.dispatchEvent(
          new KeyboardEvent('keyup', {'key':someKey} )
        )
      })
    }
    if (event.key === "Enter") {
      playRecording();
    }
    if (event.key === " ") {
      pauseRecording();
    }
    if (event.key === "Shift") {
      progress.focus();
    }
    if (event.key === "Control") {
      progress.value = 0;
      progress.nextElementSibling.innerText = "0%";
    }
  } 
)