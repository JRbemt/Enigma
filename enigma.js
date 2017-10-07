/**
 * Object   : Enigma 
 * purpose  : creates an enigma machine
 *
 * @param   : mySettings    new settings can be set which will override the default settings (@see (static object) Enigma.settings)
*/

function Enigma(mySettings) {
  if (mySettings) Enigma.settings = mySettings;

}

Enigma.prototype = {
  init      : function(){
                this.appControls = new Controls();
                this.keyboard = new Keyboard(this.appControls);
                return this; },
  startApp  : function(){
                this.keyboard.Listen();
                return this;
            },
  ToString  : function(){}
};

/**
 * settings (static object) this object is the same for all instances of the Enigma machine 
 * the machine will be created according to the settings, after that the settings shouldn't change
 *
 *   * // !NOTE : explanation of documentation : 
 *
 *            (@see (type) name)    reference to a relevant object/ enum etc.
 *            _USER                 user control (takes input) 
 *            _SHOWN                shows output
 *            (builds)              html is created
 *            <{ELEMENT}>           is the html element created or used
 *
 *
 * Setting : rotors[]   array of the rotors used, this can be any number 
 *           objects    (builds rotors.length amount of rotors) the objects hold by the array are { of_type : "type", start_position : 0, notch = 25 }
 *             -        {string} type            :  containing the rotor type (the order of letters) which resembles the wiring in a real-life rotor, this can be set to any string containing all 26 letters of the alphabet but normally an enum defined in (@see (enum) Rotor.RotorTypes) 
 *             -        {int}    start_position  :  starting position of a rotor (can be changed through gui)
 *             -        {int}    notch           :  defines when the rotor oversteps, will 25 on default
 * 
 * Setting : reflector  contains info about the reflector
 *           object     the object hold is {of_type : Reflector.ReflectorTypes.B}
 *             -        {string} of_type         :  containing the reflector type (@see (enum) Reflector.ReflectorTypes)
 *
 * Setting : input      specifies information about the input {@see (object) Keyboard}
 *             -        {string} target          :  id of the target input <TEXTFIELD>
 *  
 * Setting : lamps      settings about the lamp board which will show the last letter output  {@see (object) Lamps}
 *             -        {bool}   enabled         :  (builds) do we build a lamp board?
 *             -        {string} target          :  id of the container in which the lampboard is build
 *             -        {string} lamp_prefix     :  prefix of creates lamps -> "{lamp_prefix} + unique identifier" e.g. key_1 && key_2 
 *
 * Setting : gui        settings about the gui {@see (object) Gui}
 *             -        {bool}   enabled            :
 *             -        {bool}   slotToChar         : do we show the slots (starting_position && current_position) as chars (A-Z) or as int (1-26)
 *             -        {string} position           : (builds) id of the container in which the current rotor position is _SHOWN
 *             -        {string} rotorposition      : (builds) id of the container in which the _USER can set the starting_positions                      <INPUT type="text">
 *             -        {string} rotorselector      : (builds) id of the container in which the rotor type selector(s) is build, _USER can set type_of    <SELECT>                     (@see (enum) Rotor.RotorTypes)
 *             -        {string} displayAs          : (builds) id of the container which lets the _USER set (@see Enigma.settings.gui.slotToChar)         <INPUT type="checkbox"> 
 *             -        {string} reflectorSelector  : (builds) id of the container in which the reflector type selector is build, _USER can set type_of   <SELECT>                     (@see (enum) Reflector.ReflectorTypes)
 *             -        {string} info               : (builds) id of the container in which the info about the reflectors / rotors is _SHOWN              <DIV>                        (@see (enum) Rotor.RotorTypes) & (@see (enum) Reflector.ReflectorTypes)   
 *
 * Setting : output     settings about the output (@see (object) Output) & (@see (object) Keyboard) & (@see (object) Controls)
 *             -        {string} target             : (builds)
 *             -        {bool}   plugboard          : do we use the plugboard? wether it is build depends on (@see Enigma.settings.output.plugboardtarget) being defined or being null
 *             -        {string} plugboardconfig    : standard plugboard setting
 *             -        {string} plugboardtarget    : (builds) id of the container in which the plugboard is build                                      <INPUT type="text">          (@see (object) Plugboard)
 *             -        {string} checkplug          : (builds) id of the container which lets the USER set (@see Enigma.settings.output.plugboard)      <INPUT type="checkbox">      
 *             -        {bool}   outputToMorse      : do we convert the output to morse?                                                                                             (@see (object) Morse)
 *             -        {string} checkmorse         : (builds) id of the container which lets the USER set (@see Enigma.settings.output.outputToMorse)  <INPUT type="checkbox">      
 *
 * Setting : {bool} debug   prints some extra info in the console when true     
 *
*/
Enigma.settings = {
            rotors     :  [ /* can have any amount of rotors */
                 { of_type : Rotor.RotorTypes.EIII , start_position : 0 , notch : 25},  /* last rotor */
                 { of_type : Rotor.RotorTypes.II   , start_position : 0 , notch : 25},
                 // { of_type : Rotor.RotorTypes.I    , start_position : 0 , notch : 25},
                 // { of_type : Rotor.RotorTypes.EII  , start_position : 0 , notch : 25},
                 { of_type : Rotor.RotorTypes.EI   , start_position : 0 , notch : 25}   /* first rotor */
             ],
             reflector  :  {
                  of_type : Reflector.ReflectorTypes.B
             },
             input      : {
                  target  : "input-field"
             },
             lamps    : {
                  enabled     : true,
                  target      : "input-lamps",
                  lamp_prefix : "key"

             },
             gui      : {
                    enabled           : true,
                    slotToChar        : true,
                    position          : "rotor-positions",
                    startposition     : "rotor-startpositions",
                    rotorselector     : "rotor-type",
                    displayAs         : "rotor-display",
                    reflectorselector : "reflector-type",
                    info              : "info-settings"
              },
             output   : {
                   target          : "output-field",
                   plugboard       : true,
                   plugboardconfig : "hi to sw",
                   plugboardtarget : "enigma-plugboard",
                   checkplug       : "check-plug",
                   outputToMorse   : false,
                   checkmorse      : "check-morse"
             },
             debug    : false
          };

/* creates a new instance of an enigma machina, this function is called from (index.html)  
 * "onload" event, 
 *
*/
function createEnigma(){
  var enigmaApp = new Enigma();
  enigmaApp.init()
           .startApp();
  return enigmaApp;
}


/*
  SOURCES :
    https://en.wikipedia.org/wiki/Enigma_rotor_details
    http://www.advanced-ict.info/javascript/enigma.html
    http://www.openjs.com/scripts/enigma.php
  Performance :
    http://jsperf.com/prototype-vs-this
    http://jsperf.com/numbers-and-integers
    http://stackoverflow.com/questions/10974493/javascript-quickly-lookup-value-in-object-like-we-can-with-properties
*/
