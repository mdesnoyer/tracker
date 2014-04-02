//This code will check if jquery already exists in a given page.
//If jquery exists, then we check the version and decide if we 
//need to load our jquery version or not
//We'll need to load yepnopejs before this bootloader (http://yepnopejs.com/)

(function() {

	var requiredVersion = "1.10.0"; //TODO: we need to figure out the most compatible least version

	function getJqueryVersion() {
		if(typeof jQuery != 'undefined') {
	    	return jQuery.fn.jquery;
		} else {
			return false;
		}
	}

	function init() {
		var v = getJqueryVersion();
		if(v && v >= requiredVersion) { 
			//don't do anything
			console.log("jquery not needed");
		} else {
			//load our jquery
			yepnope({
				//TODO: this should be neon.com path
				//TODO: add neon.js here as well
				load: 'http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js',
				callback: function() {
					//jquery loaded
					console.log("jquery loaded");
					
					//now use jquery in no conflict mode
					var _neonjQuery = $.noConflict(true);
				}
			});
		}
	}

	init();
})();