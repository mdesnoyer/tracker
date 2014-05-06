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
		for (var i=0; i< scripts.length ; i++){
			if (pattern.test(scripts[i].src)) 
				return scripts[i].src;
		}
	}

