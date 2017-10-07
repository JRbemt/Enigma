/** 
 * Object   : Rotor 
 * purpose  : represents 1 rotor consisting of 26 characters
 *
 * @param   : rotortype      type_of, a rotor string containing all letters of the alphabet
 * @param   : startposition  starting position of rotor
*/  
function Rotor(rotortype, startposition , notch) {  /* constructor */
  if (rotortype.length != 26) throw "A valid rotor must contain 26 characters";
  this.rotor = rotortype;
  if (typeof startposition !== 'number' && (startposition % 1) !== 0 && startposition >= 0 )  throw "starting position must be a valid integer";
  if (notch == null || typeof notch !== 'number' || notch > 25 || notch < 0) notch = 25;
  this.startposition   = startposition;
  this.position        = startposition;
  this.notch           = notch-1;
}

/**
 * function()         {string}  ToString            returns rotor_type 
 * function()         {bool}    TurnWheel           if (position < 26) position++  and return true,  else reset the rotor and return false
 * function(){char}   {char}    EncodeChar          gets character' position in (@see Rotor.key_order) and returns that position in (@see Rotor @param rotortype)
 * function(){char}   {char}    EncodeCharInverse   gets character' position in (@see Rotor @param rotortype) and returns that position in (@see Rotor.key_order)
 * function()                   Reset               resets position of the rotor to starting position
 * var                {string}  key_order           alphabet
 * function()         {string}  getRotorType        
 * function()         {int}     getStartingPosition
 * function()         {int}     getCurrentPosition
 */
Rotor.prototype = {
  ToString            :   function(){
                                var result = "";
                                for (var i = 0; i < 26; i++) {
                                  var index = i + this.position;
                                  if (index > 25) index -= 26;
                                  result += this.rotor.charAt(index);
                                }
                                return result;
                              },
  TurnWheel           :   function(){
                              if(this.position != this.notch) {
                                  if (this.position === 25) this.position = 0;
                                  else this.position++;
                                  return false;
                                }
                              else {
                                  if (this.position === 25) this.position = 0;
                                  else this.position++;
                                  return true;
                                }
                            },
  EncodeChar          :   function(ch){
                              if (ch === " ") return ' ';
                              if (ch.length !== 1 || !ch.match(/[a-z]/i)) throw "this character is not in the alphabet";
                              var character = ch.toUpperCase();

                              var index = this.key_order.indexOf(character) - this.position;
                              if (index < 0) index = 26 + index;  /* modulo / remainder operator bugged for negative numbers*/
                              index %= 26;
                              return this.rotor.charAt(index);
                            },
  EncodeCharInverse   :   function(ch){
                              if (ch === " ") return ' ';
                              if (ch.length !== 1 || !ch.match(/[a-z]/i)) throw "this character is not in the alphabet";
                              var character = ch.toUpperCase();

                              var index = this.rotor.indexOf(character) + this.position;
                              index %= 26;
                              return this.key_order.charAt(index);
                          },
  Reset               :   function(){
                      this.position = this.startposition;
                    },
  key_order     : "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  /* getters */
  getRotorType        : function(){ return this.rotor; },
  getStartingPosition : function(){ return this.startposition; },
  getCurrentPosition  : function(){ return this.position; }
};

/**
 * static enum (independent of instance)
 * types of rotors from :  https://en.wikipedia.org/wiki/Enigma_rotor_details
 * with some details shown in (@see Enigma.settings.gui.info)
*/
Rotor.RotorTypes = {
            I   : "JGDQOXUSCAMIFRVTPNEWKBLZYH",
            II  : "NTZPSFBOKMWRCJDIVLAEYUXHGQ",
            III : "JVIUBHTCDYAKEQZPOSGXNRMWFL",

            EI   : "EKMFLGDQVZNTOWYHXUSPAIBRCJ",
            EII  : "AJDKSIRUXBLHWTMCQGZNPYFVOE",
            EIII : "BDFHJLCPRTXVZNYEIWGAKMUSQO",
            /*extra info*/
            properties : {
              I   : {introduced : "7-2-1941" , model : "German Railway (Rocket)"},
              II  : {introduced : "7-2-1941" , model : "German Railway (Rocket)"},
              III : {introduced : "7-2-1941" , model : "German Railway (Rocket)"},

              EI   : {introduced : "1930" , model : "Enigma I"},
              EII  : {introduced : "1930" , model : "Enigma I"},
              EIII : {introduced : "1930" , model : "Enigma I"}
            }
          };



