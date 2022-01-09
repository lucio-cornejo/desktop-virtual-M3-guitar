let audio;
let tabla = document.querySelector("table");
let notes = Array.prototype.slice.call(document.querySelectorAll("td"));
let audios = Array.prototype.slice.call(document.querySelectorAll("audio"));
let chromaticKeyValues = {
  "|": [0, "72.8%", "natural-note"],
  Tab: [1, "70.2%", "natural-note"],
  CapsLock: [2, "67.73%", "flat-note"],
  "<": [3, "67.73%", "natural-note"],
  1: [4, "65%", "flat-note"],
  q: [5, "65%", "natural-note"],
  a: [6, "63.2%", "flat-note"],
  z: [7, "63.2%", "natural-note"],
  2: [8, "60%", "natural-note"],
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
  v: [19, "45.3%", "natural-note"],
  5: [20, "43%", "natural-note"],
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
  m: [31, "27.9%", "natural-note"],
  8: [32, "25.45%", "natural-note"],
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
// key.code dictionary: {"Backquote":0,"Tab":1,"CapsLock":2,"IntlBackslash":3,"Digit1":4,"KeyQ":5,"KeyA":6,"KeyZ":7,"Digit2":8,"KeyW":9,"KeyS":10,"KeyX":11,"Digit3":12,"KeyE":13,"KeyD":14,"KeyC":15,"Digit4":16,"KeyR":17,"KeyF":18,"KeyV":19,"Digit5":20,"KeyT":21,"KeyG":22,"KeyB":23,"Digit6":24,"KeyY":25,"KeyH":26,"KeyN":27,"Digit7":28,"KeyU":29,"KeyJ":30,"KeyM":31,"Digit8":32,"KeyI":33,"KeyK":34,"Comma":35,"Digit9":36,"KeyO":37,"KeyL":38,"Period":39,"Digit0":40,"KeyP":41,"Semicolon":42,"Slash":43}
// key.keyCode dictionary (deprecated):  {220:0,9:1,20:2,226:3,49:4,81:5,65:6,90:7,50:8,87:9,83:10,88:11,51:12,69:13,68:14,67:15,52:16,82:17,70:18,86:19,53:20,84:21,71:22,66:23,54:24,89:25,72:26,78:27,55:28,85:29,74:30,77:31,56:32,73:33,75:34,188:35,57:36,79:37,76:38,190:39,48:40,80:41,192:42,189:43}

let keyValues = Object.keys(chromaticKeyValues);
// (Object.keys(chromatic_key_values)).map(e => parseInt(e)) // The keys were passed as strings, so we turned them to integers

let pressed = Array(keyValues.length).fill(0);

let pentagrama = document.querySelector("#pentagram");
let notesPressedCounter = 0;

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

// Function to remove the notes in the musical pentagram
function clearNotes() {
  let notesToClear = Array.prototype.slice.call(pentagrama.children);
  notesToClear = notesToClear.filter((e) => e.tagName === "DIV");
  notesToClear.forEach((e) => e.remove());
}

// Play sound after appropriate key press and change color
document.querySelector("body").addEventListener("keydown", function (e) {
  tempo = String(e.key);
  if (keyValues.includes(tempo)) {
    if (e.repeat) {
      return;
    }

    audio = audios[chromaticKeyValues[tempo][0]];
    audio.currentTime = 0;
    audio.play();
    notes[chromaticKeyValues[tempo][0]].style.background = "white";

    if (notesPressedCounter > 10) {
      clearNotes();
      notesPressedCounter = 0;
    } else {
      notesPressedCounter = notesPressedCounter + 1;
    }

    let nota = document.createElement("div");
    nota.className = chromaticKeyValues[tempo][2];
    nota.style.top = chromaticKeyValues[tempo][1];
    nota.style.left = String(8.75 * notesPressedCounter) + "%";

    pentagrama.prepend(nota);
  }
});

// Reset color
document.querySelector("body").addEventListener("keyup", function (e) {
  tempo = String(e.key);
  if (keyValues.includes(tempo)) {
    notes[chromaticKeyValues[tempo][0]].style.backgroundColor =
      "rgb(119, 116, 116)";
    notes[chromaticKeyValues[tempo][0]].style.backgroundImage =
      "radial-gradient(rgb(112, 201, 237) 20%,rgb(119, 116, 116))";
  }
});

// Change volume of notes
let volumeControl = document.querySelector("#volume-control");
volumeControl.addEventListener("mouseup", function (event) {
  audios.forEach((e) => (e.volume = volumeControl.value));
});

// Functions for automatization with Python
let t_0; // initial arbitrary time
let tracking = {}; // dictionary for times and notes
let teclas, tiempos, posicionesPlayed, notesPlayed;

function restart_recording() {
  t_0 = Date.now();
  tracking = {};
  $("body")[0].addEventListener(
    "keydown",
    (event) => (tracking[Date.now() - t_0] = event.key)
  );
  alert("Recording!!!");
}

function getTimesAndNotes() {
  alert("go crazy!");

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