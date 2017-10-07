/**
 * Object   : Gui 
 * purpose  : makes settings changeable in a non-programmatic way (graphical user interface), also it displays output and some information
 *
 * @param   : controlsRef    reference to (@see (object) Controls)
*/

function Gui(controlsRef) {
    this.controlsRef = controlsRef;
    if (Enigma.settings.gui.position !== "")            this.drawPosition();
    if (Enigma.settings.gui.startposition !== "")       this.drawStart();
    if (Enigma.settings.gui.rotorselector !== "")       this.drawTypeSelectorsRotor();
    if (Enigma.settings.gui.reflectorselector !== "")   this.drawTypeSelectorReflector();
    if (Enigma.settings.gui.plugboardtarget !== "")     this.drawPlugboard();
    this.drawCheckboxes();
    this.printSettings();
}

/**
* a lot of functions doing one of these things
                : creating and storing html elements according to (@see Enigma.settings)
                : updating gui, displaying info for _SHOWN objects
                : input ("TO"), meaning getting input for _USER objects which change the settings
                : locking  elements, meaning they will be disabled for input (settings can't changed be when encoding a message)
                
  function()    printSetting    used for giving info about the selected rotor/ reflector type
                                instead of creating a reverse map as in (@see Morse)
                                a reverse lookup is done finding the details from a selected rotor which can be less efficient
                                this is done because rotor types are dynamic (will change) and the (@see (enum) Rotor.RotorTypes) doesn't contain that much types
                                which makes it much more efficient (printSettings is updated every first KeyPress (@see (object) Keyboard))                                
*/
Gui.prototype = {
  drawPosition              : function(){                      /* create start-slots (input text) */
                                var pos = document.getElementById(Enigma.settings.gui.position);
                                var slots = [];
                                for (var i = 0; i < Enigma.settings.rotors.length; i++) {
                                    var slot = document.createElement("INPUT");
                                    slot.disabled  = true;
                                    slot.id        = "slot"+i;
                                    slot.type      = "text";
                                    slot.className = "rotor-slot";
                                    slots[i] = slot;
                                    pos.appendChild(slot);
                                }
                                this.positionSlots = slots;
                                this.updatePositionRotors(this.controlsRef.ToString());
                              },
  drawStart                 : function(){                      /* create start-slots (input text) */
                                var pos = document.getElementById(Enigma.settings.gui.startposition);
                                var slots = [];
                                for (var i = 0; i < Enigma.settings.rotors.length; i++) {
                                    var slot = document.createElement("INPUT");
                                    slot.id         = "start"+i;
                                    slot.type       = "text";
                                    slot.className  = "rotor-start";
                                    slots[i] = slot;
                                    pos.appendChild(slot);
                                }
                                this.startingSlots  = slots;
                                this.updateStartRotors();
                              },
  drawTypeSelectorsRotor    : function(){                       /* create type-slots (select) */
                                var pos = document.getElementById(Enigma.settings.gui.rotorselector);
                              	var rotorTypes ="";
                                for (var prop in Rotor.RotorTypes) {
                                  if (Rotor.RotorTypes.hasOwnProperty(prop)){
                                    if (prop !== "properties") {
                                        rotorTypes += "<option value=\""+prop+"\">"+prop+"</option>";
                                    }
                                  }
                                }

                                var slots = [];
                                for (var i = 0; i < Enigma.settings.rotors.length; i++) {
                                    var slot = document.createElement("SELECT");
                                    slot.innerHTML = rotorTypes;
                                    slot.id    = "rotorselect"+i;
                                    //slot.value = Enigma.settings.rotors[i];
                                    slot.class = "rotor-typeselector";
                                    slots[i] = slot;
                                    pos.appendChild(slot);
                                }
                                this.rotorSelectors = slots;
                                this.updateTypeRotors();
                              },
  drawTypeSelectorReflector : function(){
                                var pos = document.getElementById(Enigma.settings.gui.reflectorselector);
                                var reflectorTypes ="";

                                for (var prop in Reflector.ReflectorTypes) {
                                  if (Reflector.ReflectorTypes.hasOwnProperty(prop)){
                                    if (prop !== "properties") {
                                        reflectorTypes += "<option value=\""+prop+"\">"+prop+"</option>";
                                    }
                                  }
                                }
                                var slot = document.createElement("SELECT");
                                slot.innerHTML = reflectorTypes;
                                slot.id    = "reflectorselect";
                                //slot.value = Enigma.settings.rotors[i];
                                slot.class = "reflector-typeselector";
                                pos.appendChild(slot);

                                this.reflectorSelector = slot;
                                this.updateTypeReflector();
                              },
  drawPlugboard             : function(){
                                var target = document.getElementById(Enigma.settings.output.plugboardtarget);

                                var plugboard = document.createElement("INPUT");
                                plugboard.type = "text";
                                plugboard.className ="plugboard";
                                this.plugboard = plugboard;
                                target.appendChild(plugboard);

                                this.updatePlugboard();
                              },
  drawCheckboxes            : function(){
                                if (Enigma.settings.gui.displayAs !== "") {
                                  var displayAs = document.createElement("INPUT");
                                  displayAs.type = "checkbox";
                                  displayAs.checked = !Enigma.settings.gui.slotToChar;
                                  this.displayAs = displayAs;
                                  document.getElementById(Enigma.settings.gui.displayAs).appendChild(displayAs);
                                }
                                if (Enigma.settings.output.checkplug !== "") {
                                  var checkplugboard = document.createElement("INPUT");
                                  checkplugboard.type = "checkbox";
                                  checkplugboard.checked = Enigma.settings.output.plugboard;
                                  this.checkplugboard = checkplugboard;
                                  document.getElementById(Enigma.settings.output.checkplug).appendChild(checkplugboard);
                                }
                                if (Enigma.settings.output.checkmorse !== ""){
                                  var morseplug = document.createElement("INPUT");
                                  morseplug.type = "checkbox";
                                  morseplug.checked = Enigma.settings.output.toMorse;
                                  this.checkmorse = morseplug;
                                  document.getElementById(Enigma.settings.output.checkmorse).appendChild(morseplug);
                                }
                              },
  updateTypeRotors          : function(){                      /* get type of rotors and set them to the type-slot(s) */
                                for (var x = 0; x < Enigma.settings.rotors.length; x++) {
                                  loop2 :
                                  for (var prop in Rotor.RotorTypes) {
                                    if (Rotor.RotorTypes.hasOwnProperty(prop)) {
                                        if (Enigma.settings.rotors[x].of_type === Rotor.RotorTypes[prop]) {
                                          this.rotorSelectors[x].value = prop;
                                          break loop2;
                                        }
                                    }
                                  }
                                }
                              },
  updateTypeReflector       : function(){                      /* get type of reflector and set them to the type-slot */
                                  loop:
                                  for (var prop in Reflector.ReflectorTypes) {
                                    if (Reflector.ReflectorTypes.hasOwnProperty(prop)) {
                                        if (Enigma.settings.reflector.of_type === Reflector.ReflectorTypes[prop]) {
                                          this.reflectorSelector.value = prop;
                                          break loop;
                                        }
                                    }
                                  }
                              },
  updatePositionRotors      : function(){
                                var json = JSON.parse(this.controlsRef.ToString());
                                var i = 0;
                                for (var prop in json){
                                  if (json.hasOwnProperty(prop)) {
                                      var val = parseInt(json[prop]);
                                      if (Enigma.settings.gui.slotToChar) val = String.fromCharCode(65 + val);
                                      this.positionSlots[i].value = val;
                                    }
                                  i++;
                                }
                              },
  updateStartRotors         : function(){                       /* get startpositions and set them to the start-slots */
                                for (var x = 0; x < this.startingSlots.length; x++) {
                                    var val = this.controlsRef.rotors[x].startposition; /* already type */
                                    if (Enigma.settings.gui.slotToChar) val = String.fromCharCode(65 + val);
                                    this.startingSlots[x].value = val;
                                }
                              },
  updatePlugboard           : function(){
                                this.plugboard.value = Enigma.settings.output.plugboardconfig;
                              },
  plugboardToSetting        : function(){
                                Enigma.settings.output.plugboardconfig = this.plugboard.value;
                                this.plugboard.disabled = false;
                              },
  checkboxesToSettings      : function(){
                                if (Enigma.settings.output.checkmorse !== ""){
                                  Enigma.settings.output.outputToMorse = this.checkmorse.checked;
                                  this.checkmorse.disabled = false;
                                }
                                if (Enigma.settings.output.checkplug !== "") {
                                  Enigma.settings.output.plugboard = this.checkplugboard.checked;
                                  this.checkplugboard.disabled = false;
                                }
                                if (Enigma.settings.gui.displayAs !== "") {
                                  if (Enigma.settings.gui.slotToChar === this.displayAs.checked){
                                    Enigma.settings.gui.slotToChar = !this.displayAs.checked;
                                    this.updateStartRotors();
                                  }
                                }
                              },
  startSlotToRotor          : function(){                       /* get start-slot value and write them to rotor' startpositions */
                                for (var i = 0; i < this.startingSlots.length; i++) {
                                    var val = this.startingSlots[i].value;
                                    if (val.length === 1 && val.match(/[a-z]/i)) {  /* val = char */
                                      val = val.toUpperCase();
                                      val = val.charCodeAt();
                                      val = parseInt(val) - 65;
                                    }
                                    else if (val.length <= 2){
                                      val = parseInt(val);
                                      if (typeof val !== 'number'){ /* val = int */
                                        this.updateStartRotors(); /* reset */
                                        throw "not a valid input as startposition";
                                      }
                                    }
                                    else {
                                      this.updateStartRotors(); /* reset */
                                      throw "not a valid input as startposition";
                                    }
                                    if (this.controlsRef.rotors[i].startposition !== val){
                                        this.controlsRef.rotors[i].startposition = val;
                                    }
                                    this.startingSlots[i].disabled = false;
                                }
                                this.updateStartRotors(); /* e.g. |A|10|A| => |A|A|A| */
                                this.controlsRef.Reset();
                              },
  typeSlotToRotor           : function(){                       /* get type-slot value and write them to rotor' type */
                                for (var i = 0; i < this.rotorSelectors.length; i++) {
                                  if (this.controlsRef.rotors[i].rotor !== Rotor.RotorTypes[this.rotorSelectors[i].value]) {
                                      this.controlsRef.rotors[i].rotor = Rotor.RotorTypes[this.rotorSelectors[i].value];
                                    }
                                  this.rotorSelectors[i].disabled = false;
                                }
                              },
  typeSlotToReflector       : function(){
                                this.controlsRef.reflector.reflector = Reflector.ReflectorTypes[this.reflectorSelector.value];
                                this.reflectorSelector.disabled = false;
                              },
  lockStartSlots            : function(){                       /* disable start-slots */
                                for (var i = 0; i < this.startingSlots.length; i++) {
                                    this.startingSlots[i].disabled = true;
                                }
                              },
  lockTypeSlotsRotor        : function(){                       /* disable type-slots */
                                for (var i = 0; i < this.rotorSelectors.length; i++) {
                                    this.rotorSelectors[i].disabled = true;
                                  }
                              },
  lockTypeSlotsReflector    : function(){
                                this.reflectorSelector.disabled = true;
                              },
  lockCheckboxes            : function(){
                                if (Enigma.settings.output.checkmorse !== ""){
                                  this.checkmorse.disabled = true;
                                }
                                if (Enigma.settings.output.checkplug !== "") {
                                  this.checkplugboard.disabled = true;
                                }
                              },
  lockPlugboard             : function(){
                                this.plugboard.disabled = true;
                              },
  printSettings             : function(){
                                var tab         = document.createElement("DIV");
                                tab.className   = "info-container";

                                for (var i = 0; i < Enigma.settings.rotors.length; i++) {
                                  var rotormainInfo = document.createElement("DIV");
                                  rotormainInfo.class     = "rotorinfo-settings";

                                  var info = "rotor "+i + " : \"" + this.rotorSelectors[i].value + "\" which means the wiring is \""+this.controlsRef.rotors[i].rotor+"\"";
                                  rotormainInfo.innerHTML = info;
                                  rotormainInfo.className = "rotor-maininfo";

                                  var rotorsideInfo = document.createElement("DIV");
                                  sideinfo = "_______" + "   the model name is \""+ Rotor.RotorTypes.properties[this.rotorSelectors[i].value].model+"\" which was created on/in \"" + Rotor.RotorTypes.properties[this.rotorSelectors[i].value].introduced + "\"";
                                  rotorsideInfo.innerHTML = sideinfo;
                                  rotorsideInfo.className = "rotor-sideinfo";

                                  tab.appendChild(rotormainInfo);
                                  tab.appendChild(rotorsideInfo);
                                }
                                // TODO: make reflector
                                var reflectormainInfo = document.createElement("DIV");
                                reflectormainInfo.innerHTML = "reflector  : \""+ this.reflectorSelector.value + "\" which means the wiring is \"" + this.controlsRef.reflector.reflector+"\"";
                                reflectormainInfo.className = "reflector-maininfo";

                                var reflectorsideInfo = document.createElement("DIV");
                                reflectorsideInfo.innerHTML = "_________" + "   the model name is \""+ Reflector.ReflectorTypes.properties[this.reflectorSelector.value].model +"\" which was created on/in \"" + Reflector.ReflectorTypes.properties[this.reflectorSelector.value].introduced + "\"";
                                reflectorsideInfo.className = "reflector-sideinfo";

                                tab.appendChild(reflectormainInfo);
                                tab.appendChild(reflectorsideInfo);

                                var target = document.getElementById(Enigma.settings.gui.info);
                                target.innerHTML = "";
                                target.appendChild(tab);
                            }
};
