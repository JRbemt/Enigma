/**
 * Object   : Plugboard
 * purpose  : represent the the wired plugboard enigma machiones have
 *            character pairs will be made giving an extra layer of security
 *            - a character can't occur multiple times in the plugboard, else it'll log to console and use only the first pair containing that letter 
 *            - characters aren't substituted with a reverse map or reverse lookup instead they are substitued into the normal alphabet creating a substitution string (works similar to a rotor)
*/
function Plugboard(){

}

/**
 *  function()    init  create new substitution string from (@see Enigma.settings.output.plugboardconfig) 
 *  function()    swap  substitute input character with it's paired character
 *
*/
Plugboard.prototype = {
  substitutionString : "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  init               : function(){
                          if  (/^\s*$/.test(Enigma.settings.output.plugboardconfig)) return;
                          var check = "";
                          var matches = Enigma.settings.output.plugboardconfig.split(" ");
                          this.keyString = this.substitutionString;
                          for (var i = 0; i < matches.length; i++) {
                            if  (i >= 13) throw "too many pairs in plugboard";  //  0 <= pairs <= 26
                            var firstChar = matches[i].charAt(0).toUpperCase();
                            var secondChar = matches[i].charAt(1).toUpperCase();
                            if(check.indexOf(firstChar) === -1 && check.indexOf(secondChar) === -1) check = check + firstChar + secondChar;
                            else {console.log("multiple occurance of letters ("+firstChar +" &/or " + secondChar+") in plugboard"); continue;}
                            if (firstChar.match(/[a-z]/i) && secondChar.match(/[a-z]/i)){
                                this.keyString = this.keyString.replaceAt(this.substitutionString.indexOf(firstChar), secondChar);
                                this.keyString = this.keyString.replaceAt(this.substitutionString.indexOf(secondChar), firstChar);
                            } else throw "invalid character in plugboard";
                          }
                          console.log(this.keyString);
                        },
    swap              : function(ch){ 

                          if (ch === " ") return ' ';
                          if (ch.length !== 1 || !ch.match(/[a-z]/i)) throw "this character is not in the alphabet";
                          var character = ch.toUpperCase();
                          var index = this.substitutionString.indexOf(character);
                          return this.keyString.charAt(index);
                        }
};

/**
 * Custom function() for String a character in a string
*/
String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
};
