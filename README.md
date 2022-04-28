# Virtual M3 guitar

Inspired by the Ableton push and the M3 tuning of the guitar,
this desktop allows is a simulation of how a guitar with
the [M3 tuning](https://en.wikipedia.org/wiki/Major_thirds_tuning) would work.

## Basic use

Use the computer keyboard to play notes, which actually
are from a piano, but the **layout** of the notes, is like
in a M3 guitar (tuned in major thirds).

In the right side of the page, the notes played are displayed
in their respective form and position inside a music sheet.

## Features

<dl>
  <dt>**Restart recording**</dt>
  <dd>
    Upon press, starts recording you next keyboard inputs
    and the time between them.
  </dd>
  <dt>**Get times and notes**</dt>
  <dd>
    Stops the recording activated with the previous button.
    In the browser's console, the following information 
    will be displayed:
    
    - Time (in miliseconds) between consecutive notes.
    - Keys pressed, in order, during recording.
    - Position (in the guitar layout) of the notes played, in order, during recording.
    - Pitch classes, in order, of the notes played during recording.
  </dd>
  <dt>**Play recording**</dt>
  <dd>
    Starts simulating the user's recorded keypresses, at their respective times,
    starting from the percentage chosen in the right side of the page.
    It fixes the keyboard ghosting issue, which required chords to be played 
    as a fast arpeggio for them to be detected as an actual chord, by 
    simulating the recording playing in a non-mechanical keyboard.
  </dd>
  <dt>**Pause recording**</dt>
  <dd>
    Pause recording.
    Useful for learning a song via its recoding saved in this app:
    _Pause, see notes played, and try to play them yourself._
  </dd>
  <dt>**Clear pentagram**</dt>
  <dd>
    Delete the notes shown in the music sheet to the right.
    Useful when too many notes have been added and the page starts lagging.
  </dd>
</dl>