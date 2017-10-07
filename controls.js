/**
 * Object   : Controls
 * purpose  : most important part of the application, it builds the enigma machine according to the settings 
 *            in (@see Enigma.settings) (build) objects are created and can't be changed after the machine has been created
 *            other dynamic settings can be changed
 *            (@see (object) Controls) will also encode strings given by (@see (object) Keyboard)
 *
 * @param   : controlsRef    reference to (@see (object) Controls)
*/
function Controls() {

    this.output    = new Output();
    this.plugboard = new Plugboard();
    // create rotors + reflector
    this.rotors  = [Enigma.settings.rotors.length];
      for (var i = 0; i < Enigma.settings.rotors.length; i++) {
          this.rotors[i] = new Rotor(Enigma.settings.rotors[i].of_type, Enigma.settings.rotors[i].start_position, Enigma.settings.rotors[i].notch);
        }
    this.reflector = new Reflector(Enigma.settings.reflector.of_type);
    // create plugboard
    if (Enigma.settings.lamps.enabled) {this.lamps = new Lamps(); this.lamps.printLamps();}
    if (Enigma.settings.gui.enabled)   {this.gui   = new Gui(this);}
}
/**
 * function()       {string}      ToString        return rotor position in JSON format
 
 * function(string) {string}      EncodeMessage   calls {@see Enigma.settings.rotors}.length times {@see Rotor.EncodeChar}
                                                  then  {@see Enigma.settings.reflector}(1)  times {@see Reflector.EncodeChar}
                                                  then  {@see Enigma.settings.rotors}.length times {@see Rotor.EncodeCharInverse}
                                                  for every character, it'll return the encode string
                                                  
 * function()                     Reset           reset all rotors (@see (function) Rotor.prototype.Reset)
 * function()                     Turn            turn  last rotors (@see (function) Rotor.prototype.TurnWheel), when one rotor returns false it'll turn the next one too (double-stepping) this depends on the starting_position (notch)
 * function(string)               send            encoded string to output
*/
Controls.prototype = {
  ToString      : function(){
                    var rotorpositions = "{";
                    for (var i = 0; i < this.rotors.length; i++) {
                      rotorpositions += "\"rot"+i +"\" : \""+ (this.rotors[i].getCurrentPosition()) +"\"";
                      if (i !== (this.rotors.length-1)) {
                        rotorpositions += ", ";
                      }
                    }
                    return (rotorpositions += "}");
                  },
  EncodeMessage : function(str){
                      var result = "";

                      for (var i = 0; i < str.length; i++) {
                        var character = str.charAt(i);
                        var debug = [character];
                        if (Enigma.settings.output.plugboard) character = this.plugboard.swap(character);

                        /* go through rotors */
                        for (var x1 = 0; x1 < this.rotors.length; x1++) {
                            character = this.rotors[x1].EncodeChar(character);
                            debug[debug.length] = character;
                        }
                        /* go through reflector */
                        character = this.reflector.EncodeChar(character);
                        debug[debug.length] = "_"+character+"_";

                        /* go back through rotors */
                        for (var x2 = 0; x2 < this.rotors.length; x2++) {
                            character = this.rotors[this.rotors.length - x2 -1].EncodeCharInverse(character);
                            debug[debug.length] = character;
                        }

                        if (Enigma.settings.debug) {
                            var debugStr = "";
                            for (var x = 0; x < debug.length; x+=2) {
                              debugStr += "("+debug[x] + "->" + debug[x+1] +"), ";
                            }
                            if (Enigma.settings.debug && i === (str.length-1)) console.log(debugStr);
                          }

                        this.Turn();  // turns after encoding (move up to make it turn before encodig a char)
                        if (Enigma.settings.output.plugboard) character = this.plugboard.swap(character);
                        if (Enigma.settings.lamps.enabled && i === (str.length-1)) this.lamps.lightUpChar(character);
                        if (Enigma.settings.gui.enabled   && i === (str.length-1)) this.gui.updatePositionRotors();
                        if (Enigma.settings.debug         && i === (str.length-1)) console.log(this.ToString());
                       
                        result += character;
                      }
                      this.Reset();
                      return result;
                    },
  Reset         : function(){
    for (var i = 0; i < this.rotors.length; i++) {
      this.rotors[i].Reset();
    }
  },
  Turn          : function(){
                    var turnRotor = this.rotors.length-1;
                    while (this.rotors[turnRotor].TurnWheel()) {
                        turnRotor--;
                        if (turnRotor < 0) throw "message is too large";
                      }
                  },
  send          : function(str){
                      console.log(str);
                      this.output.send(str);
                  }
  /* getters */
};
