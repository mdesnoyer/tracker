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


//// CLICK SIMULATION ////// 
/// simulatedClick(document.getElementById('testTarget'), "click");

function simulatedClick(target, options) {

			    var event = target.ownerDocument.createEvent('MouseEvents'),
					options = options || {};

				//Set your default options to the right of ||
				var opts = {
					type: options.click 					|| 'click',
					canBubble:options.canBubble 			|| true,
					cancelable:options.cancelable 			|| true,
					view:options.view 						|| target.ownerDocument.defaultView, 
					detail:options.detail 					|| 1,
					screenX:options.screenX 				|| 0, //The coordinates within the entire page
					screenY:options.screenY 				|| 0,
					clientX:options.clientX 				|| 0, //The coordinates within the viewport
					clientY:options.clientY 				|| 0,
					ctrlKey:options.ctrlKey 				|| false,
					altKey:options.altKey 					|| false,
					shiftKey:options.shiftKey 				|| false,
					metaKey:options.metaKey 				|| false, //I *think* 'meta' is 'Cmd/Apple' on Mac, and 'Windows key' on Win. Not sure, though!
					button:options.button					|| 0, //0 = left, 1 = middle, 2 = right
					relatedTarget:options.relatedTarget		|| null,
			    }

				//Pass in the options
			    event.initMouseEvent(
					opts.type,
					opts.canBubble,
					opts.cancelable,
					opts.view, 
					opts.detail,
					opts.screenX,
					opts.screenY,
					opts.clientX,
					opts.clientY,
					opts.ctrlKey,
					opts.altKey,
					opts.shiftKey,
					opts.metaKey,
					opts.button,
					opts.relatedTarget
				);

				//Fire the event
			    target.dispatchEvent(event);
}
//////// CLICK SIMULATOR //////
//
//function simulatedClick(target, options) {
//
//			    var event = target.ownerDocument.createEvent('MouseEvents'),
//			    					options = options || {};
//
//			    									//Set your default options to the right of ||
//			    													var opts = {
//			    																		type: options.click 					|| 'click',
//			    																							canBubble:options.canBubble 			|| true,
//			    																												cancelable:options.cancelable 			|| true,
//			    																																	view:options.view 						|| target.ownerDocument.defaultView, 
//			    																																						detail:options.detail 					|| 1,
//			    																																											screenX:options.screenX 				|| 0, //The coordinates within the entire page
//			    																																																screenY:options.screenY 				|| 0,
//			    																																																					clientX:options.clientX 				|| 0, //The coordinates within the viewport
//			    																																																										clientY:options.clientY 				|| 0,
//			    																																																															ctrlKey:options.ctrlKey 				|| false,
//			    																																																																				altKey:options.altKey 					|| false,
//			    																																																																									shiftKey:options.shiftKey 				|| false,
//			    																																																																														metaKey:options.metaKey 				|| false, //I *think* 'meta' is 'Cmd/Apple' on Mac, and 'Windows key' on Win. Not sure, though!
//			    																																																																																			button:options.button					|| 0, //0 = left, 1 = middle, 2 = right
//			    																																																																																								relatedTarget:options.relatedTarget		|| null,
//			    																																																																																											    }
//
//			    																																																																																											    				//Pass in the options
//			    																																																																																											    							    event.initMouseEvent(
//			    																																																																																											    							    					opts.type,
//			    																																																																																											    							    										opts.canBubble,
//			    																																																																																											    							    															opts.cancelable,
//			    																																																																																											    							    																				opts.view, 
//			    																																																																																											    							    																									opts.detail,
//			    																																																																																											    							    																														opts.screenX,
//			    																																																																																											    							    																																			opts.screenY,
//			    																																																																																											    							    																																								opts.clientX,
//			    																																																																																											    							    																																													opts.clientY,
//			    																																																																																											    							    																																																		opts.ctrlKey,
//			    																																																																																											    							    																																																							opts.altKey,
//			    																																																																																											    							    																																																												opts.shiftKey,
//			    																																																																																											    							    																																																																	opts.metaKey,
//			    																																																																																											    							    																																																																						opts.button,
//			    																																																																																											    							    																																																																											opts.relatedTarget
//			    																																																																																											    							    																																																																															);
//
//			    																																																																																											    							    																																																																																			//Fire the event
//			    																																																																																											    							    																																																																																						    target.dispatchEvent(event);
//			    																																																																																											    							    																																																																																						    }
