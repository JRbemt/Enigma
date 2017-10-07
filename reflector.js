/** 
 * Object   : Rotor 
 * purpose  : represents 1 rotor consisting of 26 characters, the reflector is a rotor that doesn't turn and thus guarantees that a letter can also be decoded (A->Z) would in the same setting als be (Z->A)
 *
 * @param   : rotortype     type_of, a rotor string containing all letters of the alphabet
*/  
function Reflector(reflectortype) {  /* constructor */
  if (reflectortype.length != 26) throw "A valid reflector must contain 26 characters";
  this.reflector = reflectortype;
}
/*
 * (@see Rotor.prototype)
*/
Reflector.prototype = {
  ToString  : function(){},
  key_order     : "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  /* getters */
  getReflectorType    : function(){ return this.reflector; },
  EncodeChar          : function(ch){
                          if (ch === " ") return ' ';
                          if (ch.length !== 1 || !ch.match(/[a-z]/i)) throw "this character is not in the alphabet";
                          var character = ch.toUpperCase();

                          var index = this.key_order.indexOf(character);
                          index %= 26;
                          return this.reflector.charAt(index);
                        },
};

/**
 * static enum (independent of instance)
 * types of releflectors from :  https://en.wikipedia.org/wiki/Enigma_rotor_details
 * with some details shown in (@see Enigma.settings.gui.info)
*/
Reflector.ReflectorTypes = {
            A   : "EJMZALYXVBWFCRQUONTSPIKHGD",
            B   : "YRUHQSLDPXNGOKMIEBFZCWVJAT",
            C   : "FVPJIAOYEDRZXWGCTKUQSBNMHL",

            /*extra info*/
            properties : {
              A   : {introduced : "-" , model : "-"},
              B   : {introduced : "-" , model : "-"},
              C   : {introduced : "-" , model : "-"}
            }
          };
