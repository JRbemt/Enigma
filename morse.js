/** 
 * Object   : Morse 
 * purpose  : will change a character to morse or the other way around
 *            - creates a reverse map which is most efficient for larger static (non-dynamic) objects
 *            - converting the encoded string instead of per character  (@see (object) Output)
*/  
function Morse()
{
  //this.createReverse();
}
/**
 * function()                   createReverse   creates reverse map (map of morse values and their respective character)
 * function(ch)       {char}    CharToMorse     char    -> morse
 * function(string)   {string}  stringToMorse   string  -> morse
 * function(string)   {string}  morseToString   morse   -> string
*/
Morse.prototype = {
  ToString      : function(){},
  createReverse : function(){
                    var reverseMap = [];
                    for (var j in Morse.convert){
                      if (!Object.prototype.hasOwnProperty.call(Morse.convert, j)) continue;
                      reverseMap[Morse.convert[j]] = j;
                    }
                    this.reverseMap = reverseMap;
                  },
  CharToMorse   : function(ch){
                   if (ch === " ") return ' ';
                   if (!ch.match(/[a-z]/i)) throw "not a character";
                   ch = ch.toLowerCase();
                   for (var k in Morse.convert) {
                        if (k == ch) return Morse.convert[k];
                      }
                },
  stringToMorse : function(str){
                    var result = "";
                      for (var i = 0; i < str.length; i++)
                      {
                        result += this.CharToMorse(str.charAt(i));
                        if (i != str.length && result.charAt(result.length-1) != " ") result += " ";
                      }
                    return result;
                },
  morseToString : function(str){
                    var result = "";
                    var morseStr = str.replace( /  +/g, ' 0 ').split(" ");
                        for (var i = 0; i < morseStr.length; i++) {
                               if (morseStr[i] === "0") { result+=" "; continue;}
                               if (this.reverseMap.hasOwnProperty(morseStr[i])){
                                 result += this.reverseMap[morseStr[i]];
                               }
                          }
                    return result;
                }
};

/* map of characters and their respective morse value */
Morse.convert = {
  a : ".-",
  b : "-...",
  c : "-.-.",
  d : "-..",
  e : ".",
  f : "..-.",
  g : "--.",
  h : "....",
  i : "..",
  j : ".---",
  k : "-.-",
  l : ".-..",
  m : "--",
  n : "-.",
  o : "---",
  p : ".--.",
  q : "--.-",
  r : ".-.",
  s : "...",
  t : "-",
  u : "..-",
  v : "...-",
  w : ".--",
  x : "-..-",
  y : "-.--",
  z : "--.."
};
