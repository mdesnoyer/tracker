//// Events to track
// 1. Visible images loaded 
// 2. All images loaded on the page
// 3. Image click event
// 4. Video play event 

/// Create our global object
// All other objects will be children of this object, so we do not pollute
// global scope thus minimizing any interference with existing code on the website
var _neon = {};

/// JSON Script Requester 
_neon.JsonRequester = (function() {

		function JSONscriptRequest(fullUrl) {
			this.fullUrl = fullUrl; 
			this.noCacheIE = '&noCacheIE=' + (new Date()).getTime();
			this.headLoc = document.getElementsByTagName("head").item(0);
			this.scriptId = 'JscriptId' + JSONscriptRequest.scriptCounter++;
		}

		JSONscriptRequest.scriptCounter = 1;
		JSONscriptRequest.prototype.buildScriptTag = function () {
			this.scriptObj = document.createElement("script");
			this.scriptObj.setAttribute("type", "text/javascript");
			this.scriptObj.setAttribute("charset", "utf-8");
			this.scriptObj.setAttribute("src", this.fullUrl + this.noCacheIE);
			this.scriptObj.setAttribute("id", this.scriptId);
		};
		
		JSONscriptRequest.prototype.removeScriptTag = function () {
			this.headLoc.removeChild(this.scriptObj);  
		};
		
		JSONscriptRequest.prototype.addScriptTag = function () {
			this.headLoc.appendChild(this.scriptObj);
		}

		return{ 
			sendRequest: function(req){
				try 
				{
					// req: Entire url of the request along with query params
					bObj = new JSONscriptRequest(req); 
					bObj.buildScriptTag(); 
					bObj.addScriptTag();  
				}
				catch(err){
					console.log(err)
				}
				
			},
		}
}());


_neon.utils = {

	//generate a random string of given length
	getRandomString: function(len) {
		var n = parseInt((1 + Math.random()) * 100000000, 10); //a random number
		return n.toString().substr(0, len);
	},

	isHidden: function(el) {
		if(el.offsetParent === null) {
			return true;
		}
		return false;
	},

	//check if current page is referred by a page from same website
	//TODO: tackle different subdomain
	sameSiteReferral: function() {
		var referrer = document.referrer;
		if(referrer.indexOf('http://') !== -1) { //found http protocol
			referrer = referrer.substr(7);
		} else if(referrer.indexOf('https://') !== -1) { //found https protocol
			referrer = referrer.substr(8);
		} else {
			//not sure what to do
		}

		return (referrer == window.location.hostname);
	}
};

_neon.tracker = (function() {

	var uidKey = 'uid',
		thumbMap, //stores a thumbnail url -> (videoId, thumbnailId) map
		thumbViewKey = 'viewedThumbnails'; //key to localstorage which stores (video_ids, thumbnailIds) of viewed thumbnails

	function initImageLoad() {
		//wait for page load
		$(window).bind("load", function() {
			//batch all the thumbnail urls
			var urls = [];
			$('img').each(function() {
				var url = $(this).attr('src'); //this url resolves to some thumbnail id
				urls.push(url);
			});

			//assuming the url list is small enough to send as GET
			/*
			var serviceUrl = 'http://neon.com/thumbnails/get/' + urls.join();
			$.getJSON(serviceUrl, function(data) {
				//data will be an object like {url1: [vid_id, thumbnail_id], url2: [vid_id, thumbnail_id]}
			});
			*/

			//simulating response
			thumbMap = getDummyReponse(urls);
			startTracking();
		});
	}

	function startTracking() {
		console.log(document.referrer);
		//for now, assuming all images on the page are thumbnails
		//basic visibility check
		$('img').appear();
		var forced = false;

		$(document.body).on('appear', 'img', function(e, $appeared) { //callback when certain images appear in viewport
			$appeared.each(function() {
				var url = $(this).attr('src'),
					vidId = thumbMap[url][0],
					thumbId = thumbMap[url][1];

				console.log(url);

				//store the video_id-thumbnail_id pair as viewed
				_neon.StorageModule.storeThumbnail(vidId, thumbId);
				//console.log(StorageModule.getAllThumbnails("session"));
			});
		});

		//force appear the thumbnails which are visible in the initial state
		$(document.body).mousemove(function() {
			if(!forced) {
				$.force_appear();
				forced = true;
			}
		});

		//on window unload, send thumbnails viewed in the current session to the server
		//TODO: Test this properly across browsers
		$(window).bind('beforeunload', function() {
			console.log("sending viewed thumbnails to server");
			var thumbnails = _neon.StorageModule.getAllThumbnails("session");
		});
	}

	function getDummyReponse(urls) {
		var ret = {};
		ret["img/islands/1.jpeg"] = [1, "red"]; //[videoId, thumbnailId]
		ret["img/islands/2.jpeg"] = [2, "world"];
		ret["img/islands/3.jpeg"] = [3, "cat"];
		ret["img/islands/4.jpeg"] = [4, "knight"];
		ret["img/islands/5.jpeg"] = [5, "ruby"];
		ret["img/islands/6.jpeg"] = [6, "orange"];
		ret["img/islands/7.jpeg"] = [7, "blue"];
		ret["img/islands/8.jpeg"] = [8, "apple"];
		ret["img/islands/9.jpeg"] = [9, "sky"];
		ret["img/islands/10.jpeg"] = [10, "river"];
		ret["img/islands/11.jpeg"] = [11, "monk"];
		ret["img/islands/12.jpeg"] = [12, "panda"];
		return ret;
	}

	function trackVideo() {
		//capture video play event
		//event returns the video id
		$(document).on('videoplay', function(e, vidId) {
			$('#videoId').html(vidId);
			//TODO: do we need to check for domain?
			var referrer = document.referrer.split('?')[0]
			var thumb = _neon.StorageModule.getThumbnail(vidId, referrer);
			if(thumb) {
				console.log(thumb);
				$('#thumbId').html(thumb.thumbId);
				$('#timestamp').html(thumb.ts);
			
				//Sennd event request to dummy URL
				url = "http://localhost:8888/event";
				_neon.JsonRequester.sendRequest(url);
			} else {
				console.log("thumbnail not found");
				$('#thumbId').html("Not found");
			}
		});
	}


	//public methods
	return {
		init: function() {
			initImageLoad();
			trackVideo();
		},
	
	};
})();

_neon.StorageModule = (function(){
	var uidKey = 'uid',
		thumbMap, //stores a thumbnail url -> (videoId, thumbnailId) map
		thumbViewKeyPrefix = 'neonThumbnails', //key to localstorage which stores (video_ids, thumbnailIds) of viewed thumbnails
		keySeparator = ":" ; 

	/// Private methods
	function _getPageStorageKey(pageUrl){
		if(typeof(pageUrl)==='undefined'){
			// Also clean up bookmarks "#"
			// TODO: Use a "SAFE" separator to generate key
			var pageURL = document.URL.split("?")[0]
			var key = thumbViewKeyPrefix + keySeparator + pageURL; 
			return key; 
		}
		return thumbViewKeyPrefix + keySeparator + pageUrl;
	}

	/// Store thumbnails in storage	
	// Session storage: data is stored per page, keyed by page
	// Global thumbnail state is stored in local storage
	function _storeThumbnail(storage, vidId, thumbId) {
		var ts = parseInt((new Date().getTime())/1000, 10);
		
		if (storage == localStorage){
			storageKey = thumbViewKeyPrefix;
		}else{
			storageKey = _getPageStorageKey();
		}

		var data = JSON.parse(storage.getItem(storageKey));
		if(!data) data = {};
		//store if thumbnail id not already stored, else update the timestamp
		data[vidId] = {
			'thumbId': thumbId,
			'ts': ts
		};
		
		storage.setItem(storageKey, JSON.stringify(data));
	}
	
	/// Get thumbnail from storage	
	function _getThumbnail(storage, storageKey, videoId) {
		var data = JSON.parse(storage.getItem(storageKey));
		if(data) {
			return data[videoId];
		} else {
			return false;
		}
	}

	return{
		/// get the unique id
		getUid: function (){
			var uid = localStorage.getItem(uidKey);
			
			if(uid) { //if uid already exists
				return uid;
			} else { //create a unique id of length 10
				//we generate a highly randomized string to increase the probability of it being unique
				var ts = new Date().getTime(); //timestamp
				uid = _neon.utils.getRandomString(4) + _neon.utils.getRandomString(4) + ts.toString().substring(11, 13);
				localStorage.setItem(uidKey, uid);
				return uid;
			}
			console.log(uid);
		},

		/// store thumbnail to storage    
		storeThumbnail: function(vidId, thumbId) {
			_storeThumbnail(sessionStorage, vidId, thumbId);
			_storeThumbnail(localStorage, vidId, thumbId);
		},

		// get thumbnail from storage  
		// case 1: Found in session storage
		// case 2: Found in local storage
		// case 3: Not found in either
		getThumbnail: function(vidId, pageUrl){
			// pageUrl == null, request thumbnail data on same page
			// pageUrl !null, look if data is session, then local
			var storageKey = _getPageStorageKey(pageUrl);
			var ret = _getThumbnail(sessionStorage, storageKey, vidId);
			if(ret) { //if found in session storage
				console.log("accessing session storage data");
				return ret;
			} else { //check localstorage (user might have opened video in new tab)
				console.log("accessing local storage data");
				// Not a current session, hence get global state
				ret = _getThumbnail(localStorage, thumbViewKeyPrefix, vidId);
				console.log(ret);
				return ret;
			}
		},

		// Get all thumbnail data from particular storage
		getAllThumbnails: function (storage){
			if (storage == "session"){
				var	pattern = new RegExp(thumbViewKeyPrefix);
				for(var i = 0; i < sessionStorage.length; i++) {
					var key = sessionStorage.key(i);
					//console.log("key == " + key);
					//console.log(pattern);
					if(pattern.test(key)) {
						var data = sessionStorage.getItem(key);
						return data;
					}
				}
			}
			else{
				return JSON.parse(localStorage.getItem(thumbViewKeyPrefix));
			}
		},

		//Clear previous session data for the page 
		clearPageSessionData: function(pageUrl){
			if(typeof(pageUrl)==='undefined'){
				pageUrl = document.URL.split("?")[0];
				var keyMatch = _getPageStorageKey(pageUrl);
				for(var i = 0; i<sessionStorage.length; i++) {
					var key = sessionStorage.key(i);
					console.log("key : " + key + " ---> " + keyMatch);
					if(key == keyMatch) {
						console.log("remove " + key);
						sessionStorage.removeItem(key);
					}
				}
			}		
		}


	}
		

}());

_neon.PlayerTracker = (function(){
	var player, videoPlayer, content, exp, initialVideo;
	return {
			
		/// Brightcove player specific methods

		BCPlayerOnTemplateLoad: function(expID){
			console.log("Player template loaded")
			player = bcPlayer.getPlayer(expID);                 
			videoPlayer = player.getModule(APIModules.VIDEO_PLAYER);
			content = player.getModule(APIModules.CONTENT);                  
			exp = player.getModule(APIModules.EXPERIENCE); 
			videoPlayer.addEventListener(BCMediaEvent.BEGIN, 
						_neon.PlayerTracker.PlayerVideoPlay);
			//exp.addEventListener(BCExperienceEvent.CONTENT_LOAD, 
			//			PlayerImagesLoad) 
			//_neon.StorageModule.storeThumbnail("v1", "hello")
		},

		BCPlayerOnTemplateReady: function(evt){
			console.log(evt);
		},
		
		PlayerVideoPlay: function(evt){
				var vid = evt.media.id;	
				console.log("Video begin play vid: " + vid);
			/// TODO: ADD Logic here to trace back which thumbnail was clicked	
		},	
		////////// EOB
	}
}());

(function() {
	var docReadyId = setInterval(NeonInit, 100); //100ms
	
	/// Neon Init method
	function NeonInit(){
		if(document.readyState === "complete" || document.readyState === "interactive"){
			console.log(" ---- PAGE LOAD EVENT ---- ");

			//Clear the data on viewed thumbnails in session storage 
			//and update the TS in local storage	
			console.log(window.location.pathname);
			console.log(_neon.StorageModule.getAllThumbnails("session"));	
			_neon.StorageModule.clearPageSessionData();
			console.log("After clearing");
			console.log(_neon.StorageModule.getAllThumbnails("session"));	
			clearInterval(docReadyId);
		}

	}

	/// TODO: Handle this globally and resort to storing things in memory
	//run the tracker only on browsers that can suppport it
	if(sessionStorage && localStorage && JSON) {
		_neon.tracker.init();
	}
})();
