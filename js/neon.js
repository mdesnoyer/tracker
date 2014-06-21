//// Events to track
// 1. Visible images loaded 
// 2. All images loaded on the page
// 3. Image click event
// 4. Video play event 

/// Create our global object
// All other objects will be children of this object, so we do not pollute
// global scope thus minimizing any interference with existing code on the website
var _neon = _neon || {};
var neonPageId = null;


// TODO: Figure why onmouseup doesn't get registered in anonymous function
var lastMouseClick;
var lastMouseClickElement;
function _trackLastMouseClick(e){
	var elem, evt = e ? e:event;
	if (evt.srcElement)  elem = evt.srcElement;
	else if (evt.target) elem = evt.target;
	lastMouseClickElement = elem.localName;
	//if object then store click
	if (lastMouseClickElement == "object")	
		lastMouseClick = new Date().getTime();
}
document.onmouseup = _trackLastMouseClick; 


Object.size = function(obj){
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

///////////// JQUERY APPEAR PLUGIN ////////////

/*
 * jQuery appear plugin
 *
 * Copyright (c) 2012 Andrey Sidorov
 * licensed under MIT license.
 *
 * https://github.com/morr/jquery.appear/
 *
 * Version: 0.3.1
 */
(function(_$) {
	var selectors = [];

	var check_binded = false;
	var check_lock = false;
	var defaults = {
		interval: 250,
	force_process: false
	}
	var _$window = _$(window);

	var _$prior_appeared;

	function process() {
		check_lock = false;
		for (var index in selectors) {
			var _$appeared = _$(selectors[index]).filter(function() {
				return _$(this).is(':appeared');
			});

			_$appeared.trigger('appear', [_$appeared]);

			if (_$prior_appeared) {
				var _$disappeared = _$prior_appeared.not(_$appeared);
				_$disappeared.trigger('disappear', [_$disappeared]);
			}
			_$prior_appeared = _$appeared;
		}
	}

	// "appeared" custom filter
	_$.expr[':']['appeared'] = function(element) {
		var _$element = _$(element);
		if (!_$element.is(':visible')) {
			return false;
		}

		var window_left = _$window.scrollLeft();
		var window_top = _$window.scrollTop();
		var offset = _$element.offset();
		var left = offset.left;
		var top = offset.top;

		if (top + _$element.height() >= window_top &&
				top - (_$element.data('appear-top-offset') || 0) <= window_top + _$window.height() &&
				left + _$element.width() >= window_left &&
				left - (_$element.data('appear-left-offset') || 0) <= window_left + _$window.width()) {
					return true;
				} else {
					return false;
				}
	}

	_$.fn.extend({
		// watching for element's appearance in browser viewport
		appear: function(options) {
			var opts = _$.extend({}, defaults, options || {});
			var selector = this.selector || this;
			if (!check_binded) {
				var on_check = function() {
					if (check_lock) {
						return;
					}
					check_lock = true;

					setTimeout(process, opts.interval);
				};

				_$(window).scroll(on_check).resize(on_check);
				check_binded = true;
			}

			if (opts.force_process) {
				setTimeout(process, opts.interval);
			}
			selectors.push(selector);
			return _$(selector);
		}
	});

	_$.extend({
		// force elements's appearance check
		force_appear: function() {
			if (check_binded) {
				process();
				return true;
			};
			return false;
		}
	});
})(_neonjQuery);

///////////////////////////////////////////////////////////////


///////////// NEON TRACKER ////////////
(function($) {
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
			// req: Entire url of the request along with query params
			sendRequest: function(req){
				try 
				{
					bObj = new JSONscriptRequest(req);
					bObj.buildScriptTag(); 
					bObj.addScriptTag();  
				}
				catch(err){
					//console.log(err);
				}

			}
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

		isAnchor: function($el) {
			return $el.prop('tagName') == 'A';
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
		},

		getPageRequestUUID: function(){
			function randomString(length, chars) {
				var result = '';
				for (var i = length; i > 0; --i) 
					result += chars[Math.round(Math.random() * (chars.length - 1))];
				return result;
			}

			//function genRandomHexChars() {
			//	return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1); 
			//}
			//return genRandomHexChars() + genRandomHexChars() + genRandomHexChars() + genRandomHexChars();
			//
			return randomString(16, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
		},

		isOnScreen: function(el) {
			var el = $(el),
			win = $(window);

			var viewport = {
				top : win.scrollTop(),
				left : win.scrollLeft()
			};

			viewport.right = viewport.left + win.width();
			viewport.bottom = viewport.top + win.height();

			var bounds = el.offset();
			bounds.right = bounds.left + el.outerWidth();
			bounds.bottom = bounds.top + el.outerHeight();

			return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
		},

		getBackgroundImageUrl: function(el) {
			var bg = $(el).css('background-image');
			bg = bg.replace('url(','').replace(')','');
			return bg.substr(7); //remove http:// - https?
		},
	
		getQueryValue: function(qstring, param) {
			var qstringArray = qstring && qstring.substring(1).split("&"),
			  i = 0,
			  len = qstringArray.length;
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
	};

	_neon.tracker = (function() {

		var trackerAccountId,
		uidKey = 'uid',
		thumbMap, //stores a thumbnail url -> (videoId, thumbnailId) map of All Images (visible/ invisible)
		thumbViewKey = 'viewedThumbnails', //key to localstorage which stores (video_ids, thumbnailIds) of viewed thumbnails
		bgImageElArr, //array of elements which have background images
		lastClickedImage = null,
		lastClickOnNeonElementTs = null,
		lastClickOnNeonElement = null;

	//This function guesses if the given img element is a thumbnail or not
	//NOTE: Only IGN case handled for noe
	function _isThumbnail($el) {

		// return true for now
		return true; 
		
		//$parent = $el.parent();
		//if(_neon.utils.isAnchor($parent)) { //check parent
		//	return true;
		//} else { //check grandparent
		//	$parent = $parent.parent();
		//	return _neon.utils.isAnchor($parent);
		//}
	}

	// TODO(Sunil): Get thumbnail ids and video_id for Brightcove images from URL
	// STUB to be filled when Image platform is ready
	function getNeonThumbnailIds(){

		//assuming the url list is small enough to send as GET
		/*
		   var serviceUrl = 'http://neon.com/thumbnails/get/' + urls.join();
		   $.getJSON(serviceUrl, function(data) {
		//data will be an object like {url1: [vid_id, thumbnail_id], url2: [vid_id, thumbnail_id]}
		});
		*/
		//Non Image Platform thumbnails
		return
	}

	/// Detect Elements that have CSS background images with video
	/// IGN has a few web pages with this 
	function getElementsWithBackgroundImages() {
		var tags = document.getElementsByTagName('div'), //consider only divs
			len = tags.length,
			el,
			ret = [];

		for(var i = 0; i < len; i++) {
			el = tags[i];
			if (el.currentStyle) {
				if( el.currentStyle['backgroundImage'] !== 'none' ) {
					ret.push(el);
				}
			} else if (window.getComputedStyle) {
				if( document.defaultView.getComputedStyle(el, null).getPropertyValue('background-image') !== 'none' ) {
					ret.push(el);
				}
			}
		}

		return ret;
	}

	// Find adjacent elements with same link
	// This is to handle cases where headlines and images have the same link
	// Compatible with stack.com
	// TODO: handle IGN case 
	function _findAdjacentElementWithSameLink($el){
		$parent = $el.parent();
		var link = $parent.attr('href');
		var ret; 
		if(link != ""){
			var $ggparent = $parent.parent().parent().parent();
			// Only if its an Article TAG find all anchors for the children
			if($ggparent.prop("tagName") == "ARTICLE"){
				var x = $ggparent.children();
				for (var i=0 ; i<x.length; i++){
					var y = $(x[i]).find("a");
					for (var j=0; i<y.length; y++){
						var $cur = $(y[j]);
						if (link == ($cur.attr('href'))){
							if ($parent.is($cur) == false){
								ret = $cur;
							}
						}
					}
				}
			}
		}
		return ret;
	}	

	// Register Neon Image click handler to the element, its parent & grandparent
	// Explore the use of onmouseup since onclick() may already be instrumented
	function _registerClickEvent($el){
		$parent = $el.parent();

		//Add image src as a function parameter
		try{
			$el.click({imgsrc: $el.attr('src')}, imageClickEventHandler);
			// If the parent is an anchor with JS, then attach click handler
			// If its normal href, then the click event may fire twice, hence skip 
			if(_neon.utils.isAnchor($parent) && ($parent.attr('href').indexOf('http://') <0))
				$parent.click({imgsrc: $el.attr('src')}, imageClickEventHandler);

			//var $topElement = _findAdjacentElementWithSameLink($el);
			//if($topElement)
			//	$topElement.click({imgsrc: $el.attr('src')}, imageClickEventHandler);
		}catch(err){
			console.log(err);
		}	
	}
	
	// image click event handler
	function imageClickEventHandler(e){
		
		// Store the timestamp when an image was clicked
		// lastClickOnNeonElementTs = new Date().getTime();
		lastMouseClick = new Date().getTime();
		var imgSrc = e.data.imgsrc; //$(this).attr('src');
		var offset = $(this).offset(); // Get position relative to document
		var wx = offset.left - $(window).scrollLeft(); 
		var wy = offset.top - $(window).scrollTop();
		var px = offset.left;
		var py = offset.top;
		var thumbData = thumbMap[imgSrc];
		/// If the image is one that Neon cares about 
		if (typeof(thumbData) !== 'undefined'){
			var vid = thumbData[0];
			var tid = thumbData[1];
			_neon.TrackerEvents.sendImageClickEvent(vid, tid, wx, wy, px, py);
		}else{
			// May be send the img src as vid, to help track errors on resolving thumb data ?
			//_neon.TrackerEvents.sendImageClickEvent(encodeURIComponent(imgSrc), null, wx, wy, e.pageX, e.pageY);
		}
	}

	// Get the thumbnail IDs of all the images 
	function mapImagesToTids(){
		//batch all the thumbnail urls
		var urls = [];
		var imgVisibleSizes = {};  
		//Image tags
		$('img').each(function(){
			if(_isThumbnail($(this))) {
				var url = $(this).attr('src');
				//this url resolves to some thumbnail id
				if (url.indexOf("neontn") > -1 ){
					urls.push(url);
					//Attach a click handler to the image and its parent
					_registerClickEvent($(this));
					//console.log(url, $(this)[0].clientWidth, $(this).prop("scrollHeight"));
					imgVisibleSizes[url] = [$(this).width(), $(this).height()];
					//console.log(url, $(this).width(), $(this).height());
				}
			}
		});

		//Elements with background images
		//Example: http://www.ign.com/articles/2014/04/15/mechrunner-coming-to-ps4-vita-and-pc
		bgImageElArr = getElementsWithBackgroundImages();
		for(var i = 0; i < bgImageElArr.length; i++) {
			var el = bgImageElArr[i];
			var url = _neon.utils.getBackgroundImageUrl(el);
			urls.push(url);
			imgVisibleSizes[url] = [$(this).width(), $(this).height()];
			//console.log(url, $(el).width(), $(el).height());
		}

		//TODO: ThumbMAP to include the visible image size as well, currently we keep 2 maps
		thumbMap = getThumbMapForNeonThumbnails(urls);
		// console.log("TID MAPPER", thumbMap);
		// Send the loaded image set that Neon is interested in 
		_neon.TrackerEvents.sendImagesLoadedEvent(thumbMap, imgVisibleSizes);
		startTracking(urls);
	}

	function _trackLastMouseClick(e){
		var elem, evt = e ? e:event;
		if (evt.srcElement)  elem = evt.srcElement;
		else if (evt.target) elem = evt.target;
		var srcElementClick = elem.localName;
		lastClickOnNeonElement = srcElementClick;
		//if object then store click
		if (srcElementClick == "object")	
			lastClickOnNeonElementTs = new Date().getTime();
	}

	// BIND to Page load event	
	function initImageLoad() {
		//wait for page load
		$(window).bind("load", function() {
			mapImagesToTids();
			//document.onmouseup = _trackLastMouseClick; 
		});
	}

	function startTracking(imgUrls) {
		//for now, assuming all images on the page are thumbnails
		//basic visibility check
		//Add Appear event to all the images
		$('img').appear(); 
		var allVisibleSet = {}; //set of thumbnails that have been visible atleast once 
		var imagesSentSet = {}; //images sent to server

		var forced = false;
		//We check for the appearance of all images after a fixed interval
		var $imgArr = [];
		for(var i = 0; i < imgUrls.length; i++) {
			var $el = $('img[src$="' + imgUrls[i] + '"]');
			$imgArr.push($el);

			//init
			allVisibleSet[imgUrls[i]] = 0; //default to invisble
			imagesSentSet[imgUrls[i]] = 0; //default to not sent 
		}

		var lastVisibleSet = {}; //set of thumbnails visible currently

		//Every second, we get a list of images visible on the screen 
		//and compare with the last set.
		//If any new images have appeared, we add it to storage
		setInterval(function() {
			var newVisibleSet = {}; //set of thumbnails visible now
			var visibleSetChanged = false;

			//console.log("L Vset", lastVisibleSet);

			//loop through all images on the page and check which of them are visible
			for(var i=0; i<$imgArr.length; i++) {
				var $img = $imgArr[i];
				if($img.is(':appeared')) {
					var url = $img.attr('src');
					if(thumbMap.hasOwnProperty(url)) {
						vidId = thumbMap[url][0],
						thumbId = thumbMap[url][1];

						//console.log("Visible: " + url);

						if(!lastVisibleSet.hasOwnProperty(url)) { //image just appeared, store it
							allVisibleSet[url] = 1;
							//store the video_id-thumbnail_id pair as viewed
							_neon.StorageModule.storeThumbnail(vidId, thumbId);
							//console.log(StorageModule.getAllThumbnails("session"));
						}
						newVisibleSet[url] = 1; //add to the visible set
						visibleSetChanged = true;
					}
				}
				//console.log("ALL ", allVisibleSet);
			}

			
			//loop through all elements with background images and check which of them are visible
			for(var i = 0; i < bgImageElArr.length; i++) {
				var el = bgImageElArr[i];
				if(_neon.utils.isOnScreen(el)) { //if element is in viewport
					var url = _neon.utils.getBackgroundImageUrl(el);
					if(thumbMap.hasOwnProperty(url)) {
						vidId = thumbMap[url][0],
							thumbId = thumbMap[url][1];

						//console.log("Visible: " + url);

						if(!lastVisibleSet.hasOwnProperty(url)) { //image just appeared, store it
							allVisibleSet[url] = 1;
							//store the video_id-thumbnail_id pair as viewed
							_neon.StorageModule.storeThumbnail(vidId, thumbId);
							//console.log(StorageModule.getAllThumbnails("session"));
						}

						newVisibleSet[url] = 1; //add to the visible set
						visibleSetChanged = true;
					}
				}
			}

			if(visibleSetChanged) {
				//update our set of currently visible thumbnails
				lastVisibleSet = newVisibleSet;

				var visibleThumbMap = [];
				//console.log("AV", allVisibleSet);
				for(var iurl in allVisibleSet){
					if(allVisibleSet[iurl] === 1){
						//console.log("IM visible", iurl, imagesSentSet[iurl]);
						if(imagesSentSet[iurl] == 0){
							imagesSentSet[iurl] = 1;
							visibleThumbMap.push(thumbMap[iurl]);
						}
					}
				}
				
				//Send only the delta of visible images 
				// TODO: Use a Q to send images visible event	
				if(visibleThumbMap.length >0)	
					_neon.TrackerEvents.sendImagesVisibleEvent(visibleThumbMap);
			}

		}, 1000); //Let's check every second

		//on window unload, send thumbnails viewed in the current session to the server
		//TODO: Test this properly across browsers
		$(window).bind('beforeunload', function() {
			// console.log("sending viewed thumbnails to server");
			var thumbnails = _neon.StorageModule.getAllThumbnails("session");
			//TODO: Send the Images visible event, when you have a Q 
		});
	}

	//////////////////////////////////////////////////////////////////////////////
	
	/// Get Thumb map for thumbnails that Neon is interested in 
	function getThumbMapForNeonThumbnails(imgUrls){
		var ret = {};
		for(var i=0; i<imgUrls.length; i++){
			var val = parseNeonBrightcoveUrl(imgUrls[i]);
			if (val)
				ret[imgUrls[i]] = val; 
		}
		return ret;
	}

	function parseNeonBrightcoveUrl(imgUrl){
		//BCOVE URLs are of the form http://bcove/13_35_neontnAPIKEY_VID_TMD5.jpg?pb=13251 
		if (imgUrl.indexOf("neontn") > -1) {
			var parts = imgUrl.split('neontn')[1];
			var tid = parts.split('.jpg')[0];    
			var vid = tid.split('-')[1];
			return [vid, tid];
		}
		return null;
	}

	//////////////////////////////////////////////////////////////////////////////

		//public methods
		return {
			init: function() {
				initImageLoad();
				//document.onmouseup = _trackLastMouseClick; 
			},

			getTrackerAccountId: function(){
				var scriptTags = document.getElementsByTagName("script");
				for (var i = 0; i<scriptTags.length; i++) {
					sTag = scriptTags[i];
					if(sTag.src.search("neonbootloader") >= 0 || sTag.src.search("neonbctracker.js") >=0){
						return sTag.id;
					}
				} 		
			},

			getTrackerType: function(){
				return "brightcove";	
			},
		
			getLastClickNeonElementTS: function(){
				return lastMouseClick;
				//return lastClickOnNeonElementTs;
			},
			
			getLastClickNeonElement: function(){
				return lastMouseClickElement;
				//return lastClickOnNeonElement;
			},
		
			// Only used by test method	
			setLastClickNeonElement: function(ele){
				lastMouseClick = new Date().getTime();
				lastMouseClickElement = ele;
			},

			//getLastClickedImage: function(){
			//	return lastClickedImage;
			//},

			mapImagesToTids: mapImagesToTids,
			parseNeonBrightcoveUrl: parseNeonBrightcoveUrl

		};
	})();

	_neon.StorageModule = (function(){
		var uidKey = 'uid',
		thumbMap, //stores a thumbnail url -> (videoId, thumbnailId) map
		thumbViewKeyPrefix = 'neonThumbnails', //key to localstorage which stores (video_ids, thumbnailIds) of viewed thumbnails
		keySeparator = "+" ; // + is a "SAFE" separator to generate key as it doesn't appear before ? 

	/// Private methods

	function _getDomain(url){
		// expects url in the form of  "http://www.google.com";
		return url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/)[2];
	}

	function _getPageStorageKey(pageUrl, prefix){
		if(typeof(prefix)==='undefined'){
			prefix = thumbViewKeyPrefix;
		}

		if(typeof(pageUrl)==='undefined'){
			// Also clean up bookmarks "#"
			var pageURL = document.URL.split("?")[0]
				var key = prefix + keySeparator + pageURL; 
			return key; 
		}
		return prefix + keySeparator + pageUrl;
	}

	/// Store the image that was clicked in session storage
	/// This variable will be used to detect video plays without user action
	function _storeLastClickedImage(thumbId){
		storageKey = _getPageStorageKey(document.URL.split("?")[0], "clickedThumbnail");
		sessionStorage.setItem(storageKey, JSON.stringify(thumbId));
	}

	function _getLastClickedThumbnail(){
		storageKey = _getPageStorageKey(document.URL.split("?")[0], "clickedThumbnail");
		var data = JSON.parse(sessionStorage.getItem(storageKey));
		if (data == false){ 
			return null;
		}
		else{
			return data;
		}
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
		//console.log("Session:", storageKey, data, videoId);
		if(data) {
			return data[videoId];
		} else {
			return false;
		}
	}

	function _getThumbnailLocalStorage(vidId){
		ret = _getThumbnail(localStorage, thumbViewKeyPrefix, vidId);
		return ret;
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
			//console.log(uid);
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
		// @Returns thumbId, location(session/local) 
		getThumbnail: function(vidId, pageUrl){
			// pageUrl == null, request thumbnail data on same page
			// pageUrl !null, look if data is session, then local
			var locRetrieved = "session";
			var storageKey = _getPageStorageKey(pageUrl);
			//console.log("Storage key: " + storageKey);
			var ret = _getThumbnail(sessionStorage, storageKey, vidId);
			if(ret) { //if found in session storage
				//console.log("accessing session storage data");
				return [ret, locRetrieved];
			} else { //check localstorage (user might have opened video in new tab)
				if(pageUrl){
					//If the domain of pageUrl and the document.url doesn't match return null
					//console.log(_getDomain(document.URL)); 
					//console.log(_getDomain(pageUrl));
					if (_getDomain(document.URL) != _getDomain(pageUrl))
						return null;
				}	
				// Create the image click event here, coz this was opened
				// in a new tab via right click->open 

				// Not a current session, hence get global state
				ret = _getThumbnailLocalStorage(vidId);
				//_neon.TrackerEvents.sendImageClickEvent(vidId, ret ? ret[0].thumbId : null);
				if(ret){
					locRetrieved = "local";
					return [ret, locRetrieved];
				}
				return null;
			}
		},

		// Helper method defined here so that we can unit test certain scenarios
		getThumbnailSessionStorage: function(vidId, pageUrl){
			var storageKey = _getPageStorageKey(pageUrl);
			return _getThumbnail(sessionStorage, storageKey, vidId);
		},

		getThumbnailLocalStorage: function(vidId){
			return _getThumbnailLocalStorage(vidId);
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
				return null;
			}
			else{
				return JSON.parse(localStorage.getItem(thumbViewKeyPrefix));
			}
		},

		//Clear previous session data for the page 
		clearPageSessionData: function(pageUrl){
			if(typeof(pageUrl)==='undefined'){
				var pageUrl = document.URL.split("?")[0];
				var keyMatch = _getPageStorageKey(pageUrl);
				for(var i = 0; i<sessionStorage.length; i++) {
					var key = sessionStorage.key(i);
					// console.log("key : " + key + " ---> " + keyMatch);
					if(key == keyMatch) {
						// console.log("remove " + key);
						sessionStorage.removeItem(key);
					}
				}
			}		
		}


		//storeLastClickedImage: function(thumbId){
		//	return _storeLastClickedImage(thumbId);	
		//},

		//getLastClickedImage: function(){
		//	return _getLastClickedImage();
		//}


	}

	}());

	//////	 End of storage module //////////

	////// TRACKER Events sent to NEON //////////

	_neon.TrackerEvents = (function(){
		var pageLoadId = _neon.utils.getPageRequestUUID(), 
		trackerAccountID, trackerType, pageUrl, referralUrl, timestamp, eventName; 

	function buildTrackerEventData(ts){
		trackerAccountID = _neon.tracker.getTrackerAccountId();
		trackerType = _neon.tracker.getTrackerType();
		pageUrl = document.URL.split("?")[0];
		referralUrl = document.referrer.split('?')[0];
		var timestamp = new Date().getTime();
		if (typeof(ts) !== 'undefined')
			timestamp = ts
		var request = "http://trackserver-test-691751517.us-east-1.elb.amazonaws.com/v2/track?"+ "a=" + eventName + "&page=" + encodeURIComponent(pageUrl) + "&pageid=" + pageLoadId + "&ttype=" + trackerType + "&ref=" + encodeURIComponent(referralUrl) + "&tai=" + trackerAccountID + "&cts=" + timestamp;
		//var request = "http://localhost:8888/v2/track?"+ "a=" + eventName + "&page=" + encodeURIComponent(pageUrl) + "&pageid=" + pageLoadId + "&ttype=" + trackerType + "&ref=" + encodeURIComponent(referralUrl) + "&tai=" + trackerAccountID + "&cts=" + timestamp;
		return request;
	}

	// convert ThumbMap to [tid1, tid2,....]
	function convertThumbMapToTids(tmap, imSizeMap){
		var tids = [];
		for(var tm in tmap){ 
			if (tmap[tm]){
				tid = tmap[tm][1];
				// If imSizeMap is given, then create a triplet of (tid,width,height)
				if (typeof(imSizeMap) !== 'undefined'){
					tid += "+" + imSizeMap[tm][0] + "+" + imSizeMap[tm][1];
				}
				tids.push(tid);
			}
		}	
		return tids;
	}

	return {
		// tid: thumbnail id
		// xy: window xy coordinate
		sendImageClickEvent: function(vid, tid, wx, wy, px, py){
			eventName = "ic";
			var req = buildTrackerEventData();
			req += "&vid=" + vid + "&tid=" + tid;
			if(typeof(wx) !== 'undefined' && typeof(wy) !== 'undefined' && typeof(px) !== 'undefined' && typeof(py) !== 'undefined')
				req += "&wx=" + wx + "&wy=" + wy + "&x=" + px + "&y=" + py;
			_neon.JsonRequester.sendRequest(req);
		},

		// PlayerID of the player, if available
		// adPlay, mediaPlay: Are timestamps  
		sendVideoPlayEvent: function(vid, tid, playerId, adPlay, adelta, pcount){
			eventName = "vp";
			var req = buildTrackerEventData();
			req += "&vid=" + vid + "&tid=" + tid + "&adPlay=" + adPlay + "&adelta=" + adelta + "&pcount=" + pcount;
			if (typeof(playerId) !=='undefined'){
				req += "&playerid=" + playerId;
			}
			_neon.JsonRequester.sendRequest(req);
		},

		// If AD event available
		sendAdPlayEvent: function(vid, tid, playerId, adelta, pcount, adTs){
			eventName = "ap";
			var req = buildTrackerEventData(adTs);
			req += "&vid=" + vid + "&tid=" + tid + "&adelta=" + adelta + "&pcount=" + pcount;
			if (typeof(playerId) !=='undefined'){
				req += "&playerid=" + playerId;
			}
			_neon.JsonRequester.sendRequest(req);
		},

		// ImageMap is a Map of thumbnail url => tid 
		sendImagesVisibleEvent: function(imageMap){
			eventName = "iv";
			var tids = convertThumbMapToTids(imageMap);
			var req = buildTrackerEventData();
			req += "&tids="+ tids;
			_neon.JsonRequester.sendRequest(req);
		},

		// ImageMap is a Map of thumbnail url => tid
		// imSizeMap is map of url => visible im size 
		sendImagesLoadedEvent: function(imageMap, imSizeMap){
			eventName = "il";
			var tids = convertThumbMapToTids(imageMap, imSizeMap);
			var req = buildTrackerEventData();
			req += "&tids=" + tids;
			_neon.JsonRequester.sendRequest(req);
		},

		// When user clicks on the thumbnail within the player
		sendVideoClickEvent: function(vid, tid, playerId){
			eventName = "vc";
			var req = buildTrackerEventData();
			req += "&vid=" + vid + "&tid="+ tid + "&playerid=" + playerId;
			_neon.JsonRequester.sendRequest(req);
		},

		setPageLoadId: function(pId){
			pageLoadId = pId;
		}

	}

	}());

	////// BRIGHTCOVE PLAYER TRACKER //////

	_neon.BCNeonPlayerTracker = (function(){
		var player = null, videoPlayer, playerId = null, content, exp, initialVideo, initialVideoId = null, adPlayTs = null, mediaPlay = null;
		var _newMedia = true, lastTid = null, playCount = 0, adPlay = false, adelta = null, _adPlayWithVidNull = false;
		var thumbMap = {}; // url => [VID, TID]
		var vidMap = {}; // VID => TID, location(player)  

		function addVideoToMap(vid, url){
			url = url.split('?')[0];
			var vmap = _neon.tracker.parseNeonBrightcoveUrl(url);
			if (vmap != null){
				thumbMap[url] = vmap;
				var vid = vmap[0];
				var tid = vmap[1];
				vidMap[vid] = [tid, "player"];	
				_neon.StorageModule.storeThumbnail(vid, tid);
			}
		}

		function _autoPlayVideo(){
			//console.log("DELTA", adelta, lastMouseClick, adPlayTs, mediaPlay);
			if(adelta && adelta <= 2000){
				return false;
			}
			return true;
		}

		// Get TID for a video id and its location
		function getTidForVid(vid){
			var referrer = document.referrer.split('?')[0];
			var thumb;
			var tid = null;
			var loc = null;
			thumb = vidMap[vid]; 
		
			if (_autoPlayVideo()){
				// Video autoplayed
				if (playCount == 1){
					// If its the first video playing on the page then check referer session storage
					// You got here via --
					// 1. followed link on the same tab
					// 2. right click and open
					if (referrer != ""){
						//console.log("AUTOPLAY 1st video with referrer", vid, referrer);
						thumb = _neon.StorageModule.getThumbnail(vid, referrer);
						if (thumb){
							tid = thumb[0].thumbId;
							loc = thumb[1];
						}
						// Else its a phantom click, perhaps autoplay from a direct link, link from FB/Google etc
						// But tracking this means that we need to send event for all video clicks regardless of
						// Neon thumbnail or not.	
						return [tid, loc];

					}else{
						//console.log("AUTOPLAY 1st video NO referrer");
						// Since referrer is empty, you got here through a direct link 
						// check the video playlist or video loaded in the player to see which TID was shown
						return vidMap[vid];
					}

				}else{
						//console.log("AUTOPLAY >= 2", playCount, adPlayTs, mediaPlay);
						// Autoplayed and it was the 2nd video, send the TID from the player. Ignore the referrer 
						return vidMap[vid];
				}

			}else{
				// Ignore the referrer because the video didn't autoplay
				
				// Click on video object, look in video storage (vidMap)
				if(_neon.tracker.getLastClickNeonElement() == "object"){
					//console.log("You CLICKED on the player! Didn't You?");
					return vidMap[vid];
				}else{
					// Likely an image /div click	
					// Check the session storage of the current page
					//console.log("You CLICKED on Image ! Didn't You?");
					thumb = _neon.StorageModule.getThumbnail(vid);
					if (thumb){
						tid = thumb[0].thumbId;
						loc = thumb[1];
						return [tid, loc];
					}
				}	
			}
		}

                // Method to send the load and visible event for video players that only 
                // have a single video   
                function trackSingleVideoPlayerThumbnail(){
                        if(Object.size(thumbMap) >0){
                                _neon.TrackerEvents.sendImagesVisibleEvent(thumbMap);
                                imgVisibleSizes = {};
                                imgVisibleSizes[Object.keys(thumbMap)[0]] = [120, 90];
                                _neon.TrackerEvents.sendImagesLoadedEvent(thumbMap, imgVisibleSizes);
                        } 
                }

		function trackLoadedImageUrls(){
			var imageUrls = new Array();
			var imgVisibleSizes = {};  
			var mediaCollection = content.getAllMediaCollections();
			if (mediaCollection.length >0 && mediaCollection[0].mediaCount > 0){
				for(var i=0; i< mediaCollection[0].mediaCount; i++) {
					url = content.getMedia(mediaCollection[0].mediaIds[i])["thumbnailURL"];
					if (url !=null){
						url = url.split('?')[0];
						imageUrls[i] = url;
						imgVisibleSizes[url] = [120, 90]; //fix the dimension 
						var vmap = _neon.tracker.parseNeonBrightcoveUrl(url);
						if (vmap != null){
							thumbMap[url] = vmap;
							var vid = vmap[0];
							var tid = vmap[1];
							vidMap[vid] = [tid, "player"];	
							_neon.StorageModule.storeThumbnail(vid, tid);
						}
					}
				}
				if(Object.size(thumbMap) >0){
					//Images visible event
					_neon.TrackerEvents.sendImagesVisibleEvent(thumbMap);
					
					//Images Loaded event within the player
					_neon.TrackerEvents.sendImagesLoadedEvent(thumbMap, imgVisibleSizes);
				}				
		
			}
		}		

		function onMediaBegin(evt){

			if(adPlay == false){
				playCount += 1;
			}
			
			vid = evt.media.id;
			//console.log("Adplay", adPlay, playCount);	
			var thumb = getTidForVid(vid);
			var tid = null;
			var loc = null;
			
			if(thumb != null){
				tid = thumb[0];
				loc = thumb[1];
				
				// if data retrieved from local storage, then it was a new session start
				// most likely it was a right-click open; hence send that image click event
				if (loc == "local"){
					_neon.TrackerEvents.sendImageClickEvent(vid, tid);
				}
			}	

			//Send the video play event
			_neon.TrackerEvents.sendVideoPlayEvent(vid, tid, playerId, adPlay, adelta, playCount);
		
			// Send the Ad play event here since we know the video for which the ad played previously		
			if(_adPlayWithVidNull == true)
				_neon.TrackerEvents.sendAdPlayEvent(vid, tid, playerId, adelta, playCount, adPlayTs);
		}

		// When the user hits play button or autoplay request initiated
		function onMediaPlay(evt){
			mediaPlay = new Date().getTime();
			//console.log("VIDEO CLICK", adPlayTs, mediaPlay, mediaPlay - adPlayTs);
			if (_newMedia){
				_newMedia = false;
				
				// (time when player initiates request to play video - Last time an image or the player was clicked)
				var lclick = _neon.tracker.getLastClickNeonElementTS();
                // For the first video play i.e adelta is null and a click has happened, 
                // then compute the adelta. For a single bcove player, the mediachange event doesn't fire, //
                // hence compute the adelta on media play event.
				if (adelta == null && lclick)	
					adelta = mediaPlay - lclick;
				
				var vid = evt.media.id;
				initialVideoId = vid;	
				var thumb = vidMap[vid];
				var playerTid = null;
				if (thumb)
					playerTid = thumb[0];
				_neon.TrackerEvents.sendVideoClickEvent(vid, playerTid, playerId);
			}
		}

		function onAdStart(evt){
			if (initialVideoId == null)
				_adPlayWithVidNull = true;
			else
				_adPlayWithVidNull = false; //reset flag

			adPlay = true;
			adPlayTs = new Date().getTime();
			playCount += 1;
			
			// if initialVideoId == null, then delay sending the ad play 
			// if not firstAdPlay we know the video id
			if (_adPlayWithVidNull == false){
				var thumb = getTidForVid(initialVideoId);
				var tid = null;
				if (thumb)
					tid = thumb[0];
				//console.log(initialVideoId, adPlay, adPlayTs);
				_neon.TrackerEvents.sendAdPlayEvent(initialVideoId, tid, playerId, adelta, playCount);
			}
		}
	
		// USED to reset the _newMedia flag used to track if the video play initiated for the first time
		// This is the request to the player, which then triggers the mediaPlay event 
                // This event is not fired on a single video player, investigate why?	
		function onMediaChange(evt){
			mediaPlay = new Date().getTime();
			_newMedia = true;
			adPlay = false;
			initialVideoId = evt.media.id;
			// (time when player initiates request to play video - Last time an image or the player was clicked)
			var lclick = _neon.tracker.getLastClickNeonElementTS();
			if (lclick)	
				adelta = mediaPlay - lclick;
			var vid = evt.media.id;
			initialVideoId = vid;	
			var thumb = vidMap[vid];
			var playerTid = null;
			if (thumb)
				playerTid = thumb[0];
			_neon.TrackerEvents.sendVideoClickEvent(vid, playerTid, playerId);
		}

		function getPlaylists(playlists){
			var playlistIds = playlists.split(',');
			for (var j=0; j<playlistIds.length; j++){
				playlist = playlistIds[j];	
				content.getPlaylistByID(playlist, getPlaylist);
			}	
		}

		// For the playlist get the playlist data and its thumbnails 
		function getPlaylist(playlistData){
			var imageUrls = new Array();
			var imgVisibleSizes = {};  
			var videos = playlistData.videos;
			for(var i=0; i < videos.length; i++){
				url = videos[i]["thumbnailURL"];
				if (url != null){
					url = url.split('?')[0];
					imageUrls[i] = url;
					imgVisibleSizes[url] = [120, 90]; //fix the dimension 
					var vmap = _neon.tracker.parseNeonBrightcoveUrl(url);
					if (vmap != null){
						thumbMap[url] = vmap;
						var vid = vmap[0];
						var tid = vmap[1];
						vidMap[vid] = [tid, "player"];	
						_neon.StorageModule.storeThumbnail(vid, tid);
					}
				}
			}
			if(Object.size(thumbMap) >0){
					//Images visible event
					_neon.TrackerEvents.sendImagesVisibleEvent(thumbMap);

					//Images Loaded event within the player
					_neon.TrackerEvents.sendImagesLoadedEvent(thumbMap, imgVisibleSizes);
			}
		}

		/// Public Methods

		return {
			onTemplateReady: function (evt) {
				if (evt.target.experience) {
					APIModules = brightcove.api.modules.APIModules;
					if (player){
						videoPlayer = player.getModule(APIModules.VIDEO_PLAYER);
						content = player.getModule(APIModules.CONTENT);
						exp = player.getModule(APIModules.EXPERIENCE);
						videoPlayer.addEventListener(brightcove.api.events.MediaEvent.BEGIN, 
								onMediaBegin);
						videoPlayer.addEventListener(brightcove.api.events.MediaEvent.PLAY, 
								onMediaPlay);
						videoPlayer.addEventListener(brightcove.api.events.MediaEvent.CHANGE, 
								onMediaChange);
						var adModule = player.getModule(APIModules.ADVERTISING);
						adModule.addEventListener(
								brightcove.api.events.AdEvent.START, onAdStart); 
						videoPlayer.getCurrentVideo(
								function(videoDTO) {
									initialVideo = videoDTO;
									addVideoToMap(initialVideo.id, initialVideo.thumbnailURL);
                                    trackSingleVideoPlayerThumbnail();
								});
						exp.getExperienceID(function(pid){playerId=pid;});
						playerHtmlObject = document.getElementById(player.id);
						playlists = _neon.utils.getQueryValue(playerHtmlObject.data.split("?")[1], "%40playlistTabs");
						getPlaylists(playlists);
						//console.log("SMART player");

					}else{
						//Template load didn't fire -- Investigate why (Happens on IPAD)
						APIModules = brightcove.api.modules.APIModules;
						exp = evt.target.experience.getModule(APIModules.EXPERIENCE);
						exp.getExperienceID(function(pid){
							playerId = pid;
							videoPlayer = exp.experience.getModule(APIModules.VIDEO_PLAYER)
							videoPlayer.addEventListener(brightcove.api.events.MediaEvent.BEGIN,
															onMediaBegin);
							videoPlayer.addEventListener(brightcove.api.events.MediaEvent.PLAY,
															onMediaPlay);
							videoPlayer.addEventListener(brightcove.api.events.MediaEvent.CHANGE, 
															onMediaChange);
							var adModule = exp.experience.getModule(APIModules.ADVERTISING);
							adModule.addEventListener(brightcove.api.events.AdEvent.START, onAdStart);
						});
					}

				}else{
					initialVideo = videoPlayer.getCurrentVideo();
					addVideoToMap(initialVideo.id, initialVideo.thumbnailURL);
				}
			},

			onTemplateLoad: function(expID) {
				//try to fetch smart player api
				try {
					player = brightcove.api.getExperience(expID);
				 }
				catch(err){
				}	
				if(player == null){
					//Flashonly player api 
					player = bcPlayer.getPlayer(expID);
					videoPlayer = player.getModule(APIModules.VIDEO_PLAYER);
					exp = player.getModule(APIModules.EXPERIENCE);
					playerId = exp.getExperienceID();
					content = player.getModule(APIModules.CONTENT);                         
					videoPlayer.addEventListener(BCMediaEvent.BEGIN, onMediaBegin);
					videoPlayer.addEventListener(BCMediaEvent.PLAY, onMediaPlay);
					videoPlayer.addEventListener(BCMediaEvent.CHANGE, onMediaChange);
					exp.addEventListener(BCExperienceEvent.CONTENT_LOAD, 
							trackLoadedImageUrls);
					advertising = player.getModule(APIModules.ADVERTISING);
					advertising.addEventListener(BCAdvertisingEvent.AD_START, onAdStart);
					//console.log("FLASHONLY", player);
				}
			}

		}
	}());

	//Main function
	(function() {
		//We do not want the script to execute this main function while unit testing
		//TODO: Break down neon.js into separate files for each module. It will solve this problem.
		if(_neon.UNITTEST) return;

		var docReadyId = setInterval(NeonInit, 100); //100ms

		/// Neon Init method
		function NeonInit(){
			if(document.readyState === "complete" || document.readyState === "interactive"){
				//Clear the data on viewed thumbnails in session storage 
				//and update the TS in local storage	
				//console.log(window.location.pathname);
				//console.log(_neon.StorageModule.getAllThumbnails("session"));	
				_neon.StorageModule.clearPageSessionData();
				//console.log("After clearing");
				//console.log(_neon.StorageModule.getAllThumbnails("session"));	
				clearInterval(docReadyId);
				
				/// IPAD Clicks
				$(document).bind("touchstart", function(e){
						// Record any touch start on the canvas (best effort)
						lastMouseClick = new Date().getTime();
						//if(e.target)
						//	if(e.target.localName == "object")
						//		lastMouseClick = new Date().getTime();
				});

				// Create Alias for backward compatibility
				NeonPlayerTracker = _neon.BCNeonPlayerTracker;
			}

		}

		/// TODO: Handle this globally and resort to storing things in memory
		//run the tracker only on browsers that can suppport it
		if(sessionStorage && localStorage && JSON) {
			_neon.tracker.init();
		}
	})();

	})(_neonjQuery); //end of _neon obj

	///////////////////////////////////////////////////////////////
