/**
 * Merge defaults with user options
 * @private
 * @param {Object} defaults Default settings
 * @param {Object} options User options
 * @returns {Object} Merged values of defaults and options
 */
export function extend( defaults, options ) {
    var extended = {};
    var prop;
    for (prop in defaults) {
        if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
            extended[prop] = defaults[prop];
        }
    }
    for (prop in options) {
        if (Object.prototype.hasOwnProperty.call(options, prop)) {
            extended[prop] = options[prop];
        }
    }
    return extended;
};


export function randomString(size) {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  
	for (var i = 0; i < size; i++)
	  text += possible.charAt(Math.floor(Math.random() * possible.length));
  
	return text;
}

/* MATH */

export function degreesToRadians ( degrees) {
    return degrees * Math.PI / 180;
}

export function radiansToDegrees ( radians ) {
    return radians * 180 / Math.PI;
}




/**
 * @author Lee Stemkoski
 *
 * Usage: 
 * (1) create a global variable:
 *      var keyboard = new KeyboardState();
 * (2) during main loop:
 *       keyboard.update();
 * (3) check state of keys:
 *       keyboard.down("A")    -- true for one update cycle after key is pressed
 *       keyboard.pressed("A") -- true as long as key is being pressed
 *       keyboard.up("A")      -- true for one update cycle after key is released
 * 
 *  See KeyboardState.k object data below for names of keys whose state can be polled
 */
 
// initialization
export function KeyboardState()
{	
	// bind keyEvents
	document.addEventListener("keydown", KeyboardState.onKeyDown, false);
	document.addEventListener("keyup",   KeyboardState.onKeyUp,   false);	
}

///////////////////////////////////////////////////////////////////////////////

KeyboardState.k = 
{  
    8: "backspace",  9: "tab",       13: "enter",    16: "shift", 
    17: "ctrl",     18: "alt",       27: "esc",      32: "space",
    33: "pageup",   34: "pagedown",  35: "end",      36: "home",
    37: "left",     38: "up",        39: "right",    40: "down",
    45: "insert",   46: "delete",   186: ";",       187: "=",
    188: ",",      189: "-",        190: ".",       191: "/",
    219: "[",      220: "\\",       221: "]",       222: "'",
     65: "a",        68: "d",         87: "w",        83: "s"
}

KeyboardState.status = {};

KeyboardState.keyName = function ( keyCode )
{
	return ( KeyboardState.k[keyCode] != null ) ? 
		KeyboardState.k[keyCode] : 
		String.fromCharCode(keyCode);
}

KeyboardState.onKeyUp = function(event)
{
	var key = KeyboardState.keyName(event.keyCode);
	if ( KeyboardState.status[key] )
		KeyboardState.status[key].pressed = false;
}

KeyboardState.onKeyDown = function(event)
{
	var key = KeyboardState.keyName(event.keyCode);
	if ( !KeyboardState.status[key] )
		KeyboardState.status[key] = { down: false, pressed: false, up: false, updatedPreviously: false };
}

KeyboardState.prototype.update = function()
{
	for (var key in KeyboardState.status)
	{
		// insure that every keypress has "down" status exactly once
		if ( !KeyboardState.status[key].updatedPreviously )
		{
			KeyboardState.status[key].down        		= true;
			KeyboardState.status[key].pressed     		= true;
			KeyboardState.status[key].updatedPreviously = true;
		}
		else // updated previously
		{
			KeyboardState.status[key].down = false;
		}

		// key has been flagged as "up" since last update
		if ( KeyboardState.status[key].up ) 
		{
			delete KeyboardState.status[key];
			continue; // move on to next key
		}
		
		if ( !KeyboardState.status[key].pressed ) // key released
			KeyboardState.status[key].up = true;
	}
}

KeyboardState.prototype.down = function(keyName)
{
	return (KeyboardState.status[keyName] && KeyboardState.status[keyName].down);
}

KeyboardState.prototype.pressed = function(keyName)
{
	return (KeyboardState.status[keyName] && KeyboardState.status[keyName].pressed);
}

KeyboardState.prototype.up = function(keyName)
{
	return (KeyboardState.status[keyName] && KeyboardState.status[keyName].up);
}

KeyboardState.prototype.debug = function()
{
	var list = "Keys active: ";
	for (var arg in KeyboardState.status)
		list += " " + arg
	console.log(list);
}
///////////////////////////////////////////////////////////////////////////////