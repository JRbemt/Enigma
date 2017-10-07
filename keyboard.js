/** 
 * Object   : Keyboard 
 * purpose  : holds evenlisteners, it get the input and handles it according to (@see Enigma.settings)
 *            - at the moment a string is completely recoded when a new character is entered, this makes it less prone to errors,
 *            - the application will only accept (a-z)
 *            - spaces DO increase the rotors position
 *            - any special character or numbers will result in an error being thrown in the console, the character won't be encoded but this doesn't matter for any following character
 *            - changes in settings are re-evaluated every first keypress, after that _USER elements will get locked
 *
 * @param   : control_instance    instance of (@see (object) Control) needed for information about the existing rotors and the existing reflector, also we want to redirect input to it
*/  

function Keyboard(control_instance) {
    this.controlsRef = control_instance;

    var  textTarget = document.getElementById(Enigma.settings.input.target);
    this.targetTextArea = textTarget;
    if (this.targetTextArea.nodeName != "TEXTAREA") throw "target is not an <textarea>";
  }
/**
 * function()    Listen  :  create key eventlisteners
 */
Keyboard.prototype = {
    Listen      : function () {
                  // event listeners
                  var targetTextArea = this.targetTextArea;
                  var self = this.controlsRef;
                  var down = false;
                  targetTextArea.addEventListener("keyup", function (e){
                    var text = targetTextArea.value;
                    down = false;
                    if  (text.length <= 1 && Enigma.settings.gui.startingposition !== "")  { self.gui.startSlotToRotor();     if (text.length === 1) self.gui.lockStartSlots(); } /* overlap on 1 intended => (unless (backspace) the event will always be trigger with a text.length of 1 or >, yet we can ony change the staringpos before encrypting )*/
                    if  (text.length <= 1 && Enigma.settings.gui.rotorselector !== "")     { self.gui.typeSlotToRotor();      if (text.length === 1) self.gui.lockTypeSlotsRotor();}
                    if  (text.length <= 1 && Enigma.settings.gui.reflectorselector !== "") { self.gui.typeSlotToReflector();  if (text.length === 1) self.gui.lockTypeSlotsReflector();}
                    if  (text.length <= 1 && Enigma.settings.gui.info !== "")              {                                  if (text.length === 1) self.gui.printSettings();}
                    if  (text.length <= 1 && (Enigma.settings.gui.checkplug !== "" || Enigma.settings.gui.morseplug !== "" )) { self.gui.plugboardToSetting(); self.gui.checkboxesToSettings(); if (text.length === 1) {self.gui.lockCheckboxes(); self.gui.lockPlugboard();}}
                    if  (text.length <= 1 && Enigma.settings.output.plugboard)             { self.plugboard.init();}
                    self.send(self.EncodeMessage(text));
                  });
                  targetTextArea.addEventListener("keydown", function (e){
                    if (e.keyCode === 17) return;                                                                   /* don't block ctrl key for actions such as ctrl-v*/
                    else if (e.keyCode === 8){
                      if (Enigma.settings.lamps.enabled) {self.lamps.lightUpChar(" ");}                             /* reset lit lamp on backspace*/
                      if (Enigma.settings.gui.enabled && targetTextArea.value.length < 2)   {self.gui.updatePositionRotors(self.ToString());}          /* update position slots also on backspace */
                    }
                    else if (down) e.preventDefault();                                                              /* prevent holding the key down unless (backspace ket (keycode 8))*/
                    down = true;
                  });
                }
};
