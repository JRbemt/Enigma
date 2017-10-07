/**
 * Object   : Lamps 
 * purpose  : creates gui feedback after every keypress
 *            it'll show the output of the keypress by "lighting up" a lamp similar to a real enigma machine
*/

function Lamps (){

}

Lamps.prototype = {
  key_order     : "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  config        : [
                  { row_length : 9},
                  { row_length : 8},
                  { row_length : 9}
                ],
  printLamps  : function (){
                    var parent    = document.getElementById(Enigma.settings.lamps.target);
                    var indicator = 0;
                    for (var i = 0; i < this.config.length; i++) {
                      var row       = document.createElement("DIV");
                      row.className = "lamp-row";
                      row.id = "row" + i;

                      for (var x = 0; x < this.config[i].row_length; x++) {
                         var character = this.key_order.charAt(indicator);
                         var btn       = document.createElement("DIV");
                         btn.id        = Enigma.settings.lamps.lamp_prefix + character;
                         btn.className = "key-lamp";
                         btn.innerHTML = character;
                         row.appendChild(btn);
                         indicator++;
                      }
                      parent.appendChild(row);
                    }
                  },  
  lightUpChar : function (ch){
                    if (this.lit) this.lit.style.backgroundColor = "lightseagreen";
                    if (ch === " ") return ' ';
                    var key   = document.getElementById(Enigma.settings.lamps.lamp_prefix +ch.toUpperCase());
                    this.lit = key;
                    key.style.backgroundColor = "lightcoral";
                  }
};
