let audio;
const tabla = document.querySelector("table");
let notes = Array.prototype.slice.call(document.querySelectorAll("td"));
const audios = Array.prototype.slice.call(document.querySelectorAll("audio"));

const chromaticKeyValues = {
  "|": [0, "73.75%", "natural-note"],        // E
  "Tab": [1, "71%", "natural-note"],
  "CapsLock": [2, "68.5%", "flat-note"],
  "<": [3, "68.5%", "natural-note"],
  "1": [4, "65.75%", "flat-note"],
  "q": [5, "65.75%", "natural-note"],
  "a": [6, "64%", "flat-note"],
  "z": [7, "64%", "natural-note"],          // B
  "2": [8, "61%", "natural-note"],            // C
  "w": [9, "58%", "flat-note"],
  "s": [10, "58%", "natural-note"],
  "x": [11, "55.6%", "flat-note"],
  "3": [12, "55.6%", "natural-note"],
  "e": [13, "53.4%", "natural-note"],
  "d": [14, "50.45%", "flat-note"],
  "c": [15, "50.45%", "natural-note"],       // G4
  "4": [16, "48%", "flat-note"],
  "r": [17, "48%", "natural-note"],
  "f": [18, "45.3%", "flat-note"],
  "v": [19, "45.3%", "natural-note"],         // B
  "5": [20, "43%", "natural-note"],           // C  
  "t": [21, "40.4%", "flat-note"],
  "g": [22, "40.4%", "natural-note"],
  "b": [23, "37.8%", "flat-note"],
  "6": [24, "37.8%", "natural-note"],
  "y": [25, "35%", "natural-note"],
  "h": [26, "32.5%", "flat-note"],
  "n": [27, "32.5%", "natural-note"],
  "7": [28, "29.75%", "flat-note"],
  "u": [29, "29.75%", "natural-note"],
  "j": [30, "27.5%", "flat-note"],
  "m": [31, "27.5%", "natural-note"],          // B
  "8": [32, "24.5%", "natural-note"],         // C
  "i": [33, "22.25%", "flat-note"],
  "k": [34, "22.25%", "natural-note"],
  ",": [35, "19.25%", "flat-note"],
  "9": [36, "19.25%", "natural-note"],
  "o": [37, "16.75%", "natural-note"],
  "l": [38, "14%", "flat-note"],
  ".": [39, "14%", "natural-note"],
  "0": [40, "11.75%", "flat-note"],
  "p": [41, "11.75%", "natural-note"],
  "ñ": [42, "8.75%", "flat-note"],
  "-": [43, "8.75%", "natural-note"],
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

let stopPlayRecordingFunction = false;
function stopRecording () {
  stopPlayRecordingFunction = true;
}

let chordsPseudoCounter = 0;
async function playRecording() {
  // Reset stop of function (fixes bug
  // where playRecording needed to be
  // called twice in order to activate)
  stopPlayRecordingFunction = false;
  
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
    if (stopPlayRecordingFunction === true) {
      stopPlayRecordingFunction = false;
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
        if (stopPlayRecordingFunction === true) {
          stopPlayRecordingFunction = false;
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
      stopRecording();
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