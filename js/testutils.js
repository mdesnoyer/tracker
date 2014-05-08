	function getDummyReponse(urls) {
		var ret = {};
		for(var i = 0; i < urls.length; i++) {
			if (urls[i].indexOf("brightcove") > -1){
				var parts = urls[i].split("-");
				var vidId = parts[parts.length -1].split('.jpg')[0];
				var thumbId = urls[i]; 
			}else{
				var vidId = (i+1);
				var thumbId = "thumb" + (i+1);
			}
			ret[urls[i]] = [vidId, thumbId];
		}
		return ret;
	}

	function getSizes(urls){
		var ret = {};
		for(var i = 0; i < urls.length; i++) {
			ret[urls[i]] = [120, 90];
		}
		return ret;
	}

	// Extract token value from the query string
	function getQueryValue(qstring, param) {
		var qstringArray = qstring && qstring.substring(1).split("&"),
		  i = 0,
		  len = qstringArray.length;
		//console.log(qstringArray);
	  for (; i < len; i++) {
		  var token = qstringArray[i],
			  eqIndex = token.indexOf("="),
			  firstPart = token && token.substring(0, eqIndex);
		  if (firstPart === param ) {
			  return token.substring(eqIndex + 1, token.length);
		  }
	  }
	}

	// Get script tag	
	function getScriptTag(eventName){
		var pattern = new RegExp(eventName);
		var scripts = document.getElementsByTagName("script");
		var ret;
		for (var i=0; i< scripts.length ; i++){
			if (pattern.test(scripts[i].src)) 
				ret = scripts[i].src;
		}
		// return the last match
		return ret;
	}


//// EVENT SIMULATION 

function simulate(element, eventName)
{
    var options = extend(defaultOptions, arguments[2] || {});
    var oEvent, eventType = null;

    for (var name in eventMatchers)
    {
        if (eventMatchers[name].test(eventName)) { eventType = name; break; }
    }

    if (!eventType)
        throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

    if (document.createEvent)
    {
        oEvent = document.createEvent(eventType);
        if (eventType == 'HTMLEvents')
        {
            oEvent.initEvent(eventName, options.bubbles, options.cancelable);
        }
        else
        {
            oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
            options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
            options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
        }
        element.dispatchEvent(oEvent);
    }
    else
    {
        options.clientX = options.pointerX;
        options.clientY = options.pointerY;
        var evt = document.createEventObject();
        oEvent = extend(evt, options);
        element.fireEvent('on' + eventName, oEvent);
    }
    return element;
}

function extend(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
}

var eventMatchers = {
    'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
    'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
}
var defaultOptions = {
    pointerX: 0,
    pointerY: 0,
    button: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    bubbles: true,
    cancelable: true
}

