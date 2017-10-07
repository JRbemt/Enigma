/** 
 * Object   : Output 
 * purpose  : outputs encoded string
*/  

function Output(){
    this.outputTarget = document.getElementById(Enigma.settings.output.target);
    this.morse = new Morse();
  }
  Output.prototype = {
    send  : function(str){
              var output = str;
              if (Enigma.settings.output.outputToMorse)  output = this.morse.stringToMorse(str);
              this.outputTarget.value = output;
            }
  };
