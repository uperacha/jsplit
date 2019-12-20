/*
 * jSplit 0.1
 *
 * Copyright (C) 2012 Umair H. Peracha (https://github.com/uperacha/)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 */
 
;(function ( $, window, undefined ) {
  var pluginName = 'jSplit',
      document = window.document,
      defaults = {
        orientation: "vertical",
		minSize: 100,
		color: "gray"
      };
	  
  function Plugin( element, options ) {
    this.element = element;
	this.options = $.extend( {}, defaults, options) ;
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  Plugin.prototype.init = function () {
	var n =  this.options.children;
	var $elm = $(this.element);
	var width = $elm.width();
	var height = $elm.height();
	var splitterHeight = height;
	var splitterWidth = width;
	var isFloat = "none";
	var cursor;
	var axis ;
	var minSize = this.options.minSize;
	if(this.options.orientation == "horizontal"){
		height = height / 2 - 3;
		splitterHeight = 4;
		cursor = "n-resize";
		axis = "y";
	}
	else{
		width = width / 2 - 3;
		splitterWidth = 4;
		isFloat = "left";
		cursor = "e-resize";
		axis = "x";
	}
	var $div1 = $($elm.children()[0]).css({"height": height, "width": width, "float": isFloat});
	var $div2 = $($elm.children()[1]).css({"height": height, "width": width, "float": isFloat});
	var $splitter = $("<div></div>").css({"height": splitterHeight+"px", "width": splitterWidth+"px", "background-color": this.options.color, "cursor": cursor, "margin": "0px", "float": isFloat}).insertAfter($div1);
		
	var lastPosition = 0;
	$splitter.draggable({
		axis: axis,
		containment: this.element.id,
		scroll: false,
		drag: function (event, ui) {
			
			var defaultLevel = minSize; // a div cannot be reduced more than this level 

			var div1 = $div1.height(); // current height of top div
			var div2 = $div2.height(); // current height of bottom div
			if(axis == "x"){
				div1 = $div1.width(); // current width of left div
				div2 = $div2.width(); // current width of right div
			}


			var vhPosition = ((axis == "y")? ui.position.top : ui.position.left) - lastPosition;
			lastPosition = ((axis == "y")? ui.position.top : ui.position.left);

			if (vhPosition > 0) {  // if the movement is downwards / rightwards

				if (Math.abs(vhPosition) + defaultLevel < div2) { // adjusting for default level

					div1 += Math.abs(vhPosition); // increase top div height / left div width
					div2 -= Math.abs(vhPosition); // decrease bottom div height / right div width
				}
				else {
					div1 += div2 - defaultLevel;
					div2 = defaultLevel;
				}
			}
			else { // if the movement is upwards / leftwards

				if (Math.abs(vhPosition) + defaultLevel < div1) { // adjusting for default level

					div1 -= Math.abs(vhPosition); // decrease top div height / left div width
					div2 += Math.abs(vhPosition); // increase bottom div height / right div width
				}
				else {
					div2 += div1 - defaultLevel; 
					div1 = defaultLevel;
				}
			}                   

			// set the heights / widths of divs
			if(axis == "x"){
				$div1.width(div1);
				$div2.width(div2);
				// Resets the position of slider to 0 otherwise the slider futher jumps (left/right) "left" times 
				// due to movement of left and right divs.
				ui.position.left = 0;
			}
			else{					
				$div1.height(div1);
				$div2.height(div2);
				// Resets the position of slider to 0 otherwise the slider futher jumps (up/down) "top" times 
				// due to movement of top and bottom divs.
				ui.position.top = 0;
			}


			

		},
		stop: function (event, ui) {
			lastPosition = 0; // release value of lastPosition because it was making vhPosition calculate wrong values
		}
	});
  };

  $.fn[pluginName] = function ( options ) {
    return this.each(function () {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
      }
    });
  }
}(jQuery, window));
