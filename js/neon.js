(function() {

	var _neon = {};

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
		}
	};

	_neon.tracker = (function() {

		var uidKey = 'uid',
			thumbMap, //stores a thumbnail url -> (videoId, thumbnailId) map
			thumbViewKey = 'viewedThumbnails'; //key to localstorage which stores (video_ids, thumbnailIds) of viewed thumbnails

		//get the unique id
		function getUid() {
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
		}

		function _storeThumbnail(storage, vidId, thumbId) {
			var data = JSON.parse(storage.getItem(thumbViewKey));

			if(!data) data = {};

			var ts = parseInt((new Date().getTime())/1000, 10);

			//store if thumbnail id not already stored, else update the timestamp
			data[vidId] = {
				'thumbId': thumbId,
				'ts': ts
			};
			storage.setItem(thumbViewKey, JSON.stringify(data));
		}

		function storeThumbnail(vidId, thumbId) {
			_storeThumbnail(sessionStorage, vidId, thumbId);
			_storeThumbnail(localStorage, vidId, thumbId);
		}

		function _getThumbnail(storage, vidId) {
			var data = JSON.parse(storage.getItem(thumbViewKey));
			if(data) {
				return data[vidId];
			} else {
				return false;
			}
		}

		function getThumbnail(vidId) {
			var ret = _getThumbnail(sessionStorage, vidId);
			if(ret) { //if found in session storage
				return ret;
			} else { //check localstorage (user might have opened video in new tab)
				ret = _getThumbnail(localStorage, vidId);
				return ret;
			}
		}

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
					storeThumbnail(vidId, thumbId);
				});
			});

			//force appear the thumbnails which are visible in the initial state
			$(document.body).mousemove(function() {
				if(!forced) {
					$.force_appear();
					forced = true;
				}
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
				//TODO: check for document.referrer
				var thumb = getThumbnail(vidId);
				if(thumb) {
					console.log(thumb);
					$('#thumbId').html(thumb.thumbId);
					$('#timestamp').html(thumb.ts);
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

			getUid: getUid
		};
	})();

	//run the tracker only on browsers that can suppport it
	if(sessionStorage && localStorage && JSON) {
		_neon.tracker.init();
	}

})();