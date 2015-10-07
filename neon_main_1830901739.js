var neonPublisherId = '1830901739';
var neonTrackerType = 'gen';var _neon = _neon || {},
    neonPageId = null,
    videoIds = [],
    imgObjs = [],
    apiBaseURL = 'i3.neon-images.com',
    lastMouseClick,
    lastMouseClickElement
    eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent',
    eventer = window[eventMethod],
    messageEvent = (eventMethod == 'attachEvent') ? 'onmessage' : 'message'
;

function _trackLastMouseClick(e) {
    var elem,
        evt = e || event;
    if (evt.srcElement) {
        elem = evt.srcElement;
    }
    else {
        if (evt.target) {
            elem = evt.target;
        }
    }
    lastMouseClickElement = elem.localName;
    // if object then store click
    if (lastMouseClickElement == 'object') {
        lastMouseClick = new Date().getTime();
    }
}
document.onmouseup = _trackLastMouseClick; 

// Listen to message from child window
eventer(messageEvent,function(e) {
    orig = e.origin;
    if (orig.indexOf(apiBaseURL) > -1) {
        startTrackingNeonISPImages(e.data); 
    }
}, false);

Object.size = function(obj) {
    var size = 0,
        key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            size++;
        }
    }
    return size;
};

///////////// JQUERY APPEAR PLUGIN ////////////

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
    // we want to know everytime a node is inserted
 
    /// JSON Script Requester
    _neon.JsonRequester = (function() {

        function JSONscriptRequest(fullUrl) {
            this.fullUrl = fullUrl; 
            this.noCacheIE = '&noCacheIE=' + (new Date()).getTime();
            this.headLoc = document.getElementsByTagName('head').item(0);
            this.scriptId = 'JscriptId' + JSONscriptRequest.scriptCounter++;
        }

        JSONscriptRequest.scriptCounter = 1;
        JSONscriptRequest.prototype.buildScriptTag = function () {
            this.scriptObj = document.createElement('script');
            this.scriptObj.setAttribute('type', 'text/javascript');
            this.scriptObj.setAttribute('charset', 'utf-8');
            this.scriptObj.setAttribute('src', this.fullUrl + this.noCacheIE);
            this.scriptObj.setAttribute('id', this.scriptId);
        };

        JSONscriptRequest.prototype.removeScriptTag = function () {
            this.headLoc.removeChild(this.scriptObj);  
        };

        JSONscriptRequest.prototype.addScriptTag = function () {
            this.headLoc.appendChild(this.scriptObj);
        }

        return {
            // req: Entire url of the request along with query params
            sendRequest: function(req) {
                try  {
                    bObj = new JSONscriptRequest(req);
                    bObj.buildScriptTag(); 
                    bObj.addScriptTag();  
                }
                catch(err) {
                    // console.log(err);
                }
            }
        }
    }());

    _neon.utils = {

        // Generate a random string of given length
        getRandomString: function(len) {
            var n = parseInt((1 + Math.random()) * 100000000, 10); // a random number
            return n.toString().substr(0, len);
        },

        isHidden: function(el) {
            return el.offsetParent === null;
        },

        beacon: function() {
            if (true) {
                console.log('[neon]', arguments);
            }
        },

        isAnchor: function($el) {
            return $el.prop('tagName') === 'A';
        },

        // check if current page is referred by a page from same website
        // TODO: tackle different subdomain
        sameSiteReferral: function() {
            var referrer = document.referrer;
            if (referrer.indexOf('http://') !== -1) { // found http protocol
                referrer = referrer.substr(7);
            } else if (referrer.indexOf('https://') !== -1) { // found https protocol
                referrer = referrer.substr(8);
            } else {
                // not sure what to do
            }
            return (referrer == window.location.hostname);
        },

        getPageRequestUUID: function() {
            function randomString(length, chars) {
                var result = '';
                for (var i = length; i > 0; --i) {
                    result += chars[Math.round(Math.random() * (chars.length - 1))];
                }
                return result;
            }
            return randomString(16, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
        },

        isOnScreen: function(el) {
            var $el = $(el),
                $win = $(window),
                bounds = $el.offset()
                viewport = {
                    top: $win.scrollTop(),
                    left: $win.scrollLeft()
                }
            ;
            viewport.right = viewport.left + $win.width();
            viewport.bottom = viewport.top + $win.height();
            bounds.right = bounds.left + $el.outerWidth();
            bounds.bottom = bounds.top + $el.outerHeight();
            return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
        },

        // Check object and if it is a jQuery object, return it, otherwise cast
        // it to a jQuery object.
        makeJQueryObject: function(obj) {
            return (obj instanceof jQuery ? obj : $(obj));
        },

        getMysteryElementImageSource: function (el) {
            var $el = _neon.utils.makeJQueryObject(el);
            return _neon.utils.getElementImageSource($el) || _neon.utils.getElementBackgroundImageSource($el);
        },

        getElementImageSource: function(el) {
            var $el = _neon.utils.makeJQueryObject(el),
                returnValue = $el.attr('data-original') || $el.attr('src') || ''
            ;
            return returnValue;
        },

        getElementBackgroundImageSource: function(el) {
            var $el = _neon.utils.makeJQueryObject(el),
                returnValue = $el.attr('data-background-image') || $el.css('background-image') || ''
            ;
            if (returnValue === 'none') { // ugh
                returnValue = '';
            }
            return returnValue;
        },

        // given a root element (jQuery or Javascript), look for:
        // 1. regular <img /> with src attribute
        // 2. sleepy <img /> with source in other attribute(s)
        // 3. regular element with background-image in style attribute
        // 3. sleepy element with background-image in other attribute(s)

        getElementsUsingImageSourceSelector: function(imageSource, rootElement) {

            var specificSource = imageSource ? '$="' + imageSource + '"' : '',
                $rootElement = _neon.utils.makeJQueryObject(rootElement),
                $images = $rootElement.find('img[data-original' + specificSource + '], img[src' + specificSource + ']');

            var $others = $rootElement.find('*').filter(function() {
                var backgroundImageUrl = _neon.utils.getElementBackgroundImageSource(this);
                if (imageSource) {
                    return backgroundImageUrl.indexOf(imageSource) > -1;
                }
                else {
                    return backgroundImageUrl !== '';
                }
            });

            var $all = $images.add($others);
            return $all;
        },

        getQueryValue: function(qstring, param) {
            var qstringArray = qstring && qstring.substring(1).split('&'),
                i = 0,
                len = qstringArray.length
            ;
            for (; i < len; i++) {
                var token = qstringArray[i],
                    eqIndex = token.indexOf('='),
                    firstPart = token && token.substring(0, eqIndex)
                ;
                if (firstPart === param ) {
                    return token.substring(eqIndex + 1, token.length);
                }
            }
        }

        // Get script tag   
    };

    /////// Tracker Methods ////////
    
    _neon.tracker = (function() {

        var trackerAccountId,
            uidKey = 'uid',
            thumbMap, // stores a thumbnail url => (videoId, thumbnailId) map of All Images (visible/ invisible)
            thumbViewKey = 'viewedThumbnails', // key to localstorage which stores (video_ids, thumbnailIds) of viewed thumbnails
            videoIdsCount = 0,
            trackerProcessedCount = 0,
            initialLoadComplete = false, 
            lastClickedImage = null,
            lastClickOnNeonElementTs = null,
            lastClickOnNeonElement = null
            lastClickMap = {}; // Store the timestamp of a click for a given TID
            lastClickThreshold  = 50 // 50ms
        ;

    // Find adjacent elements with same link
    // This is to handle cases where headlines and images have the same link
    // Compatible with stack.com
    // IGN case is handled in its own method 
    function _findAdjacentElementWithSameLink($el) {
        $parent = $el.parent();
        var link = $parent.attr('href');
        var ret; 
        if (typeof(link) != 'undefined' && link != '') {
            var $gparent = $parent.parent().parent();
            var $ggparent = $parent.parent().parent().parent();
            // Only if its an Article TAG find all anchors for the children
            // Article tag is comon with publishers
            if ($ggparent.prop('tagName') == 'ARTICLE') {
                var x = $ggparent.children();
                for (var i=0 ; i < x.length; i++) {
                    var y = $(x[i]).find("a");
                    for (var j=0; i < y.length; y++) {
                        var $cur = $(y[j]);
                        if (link == ($cur.attr('href'))) {
                            if ($parent.is($cur) == false) {
                                ret = $cur;
                            }
                        }
                    }
                }
            }
        }
        return ret;
    }   

    // Register click event to adjacent element of the image
    // IGN uses the following hirearchy
    // class="listElmnt" has 2 children -- listElmnt-thumb & listElmnt-blogItem
    // All clickable elements in here must be have a click handler registered
    function _registerClickEventToAdjacentElementWithSameLinkIGN($el) {
        $parent = $el.parent();
        var link = $parent.attr('href');
        var ret; 
        if (typeof(link) != 'undefined' && link != "") {
            var $gparent = $parent.parent().parent(); // class listElmnt
            if ($gparent.prop('class') == "listElmnt") {
                // Attach event to the anchor tag, so that click on play button
                // will produce an IC event
                var t = $($gparent.children()[0]),
                    at = t.find('a'),
                    click_attr = _neon.utils.getMysteryElementImageSource($el)
                ;
                at.click({imgsrc: click_attr}, imageClickEventHandler);

                
                var x = $($gparent.children()[1]);
                // May cause double IC events
                // x.click({imgsrc: $el.attr('src')}, imageClickEventHandler); 
                // Attach event to listElemnt-thumb
                for (var i = 0 ; i < x.length; i++) {
                    if (x.prop("class") == "listElmnt-blogItem") {
                        var y = x.children();
                        for (var j=0; j<y.length; j++) {
                            var z = $(y[j]).find("a");
                            for (var k=0; k<z.length; k++) {
                                $(z[k]).click({imgsrc: click_attr}, imageClickEventHandler); 
                            }
                        }
                    }
                }
            }
            // Look for grid_16 alpha 
            else if ($gparent.prop("class").indexOf("grid") > -1) {
                var t = $($gparent.children()[1]); //grid_12.omega
                var at = t.find("a");
                at.click({imgsrc: click_attr}, imageClickEventHandler); 
            }
        } 
    }


    /// Find the video elements, check if they have a Neon thumbnail
    /// If yes, then attach the click event
    function attachClickEventToHTML5VideoElement() {
        var videoElements = document.getElementsByTagName("video");
        for(var i = 0; i <videoElements.length; i++) {
            var vElement = videoElements[i];
            var siblings = $(vElement).siblings();
            var inpElement;
            var imgSrc;
            for(var j=0; j<siblings.length; j++) {
                // Find the input element with image type
                var el = siblings[j];
                if (el.tagName == 'IMG')
                    imgSrc= el.src;

                if (el.type == 'image')
                    inpElement = el;
            }
            if (imgSrc && inpElement) {
                $(inpElement).click({imgsrc: imgSrc}, imageClickEventHandler);
            }
        }
    
    }

    // Register Neon Image click handler to the element, its parent & grandparent
    // Explore the use of onmouseup since onclick() may already be instrumented
    // @input: JQuery object
    function _registerClickEvent($el) {
        $parent = $el.parent();
        $gparent = $parent.parent();

        // Add image src as a function parameter
        try {
            
            var click_attr = _neon.utils.getMysteryElementImageSource($el);
            _neon.utils.beacon('_registerClickEvent', click_attr);
            $el.click({imgsrc: click_attr}, imageClickEventHandler);
            $parent.click({imgsrc: click_attr}, imageClickEventHandler);

            // DISCOVERY specific
            //$gparent.click({imgsrc: $el.attr('src')}, imageClickEventHandler);
            
            // Handle IGN case of linking adjacent elements 
            _registerClickEventToAdjacentElementWithSameLinkIGN($el);

            // May not be requested any more...
            // If the parent is an anchor with JS, then attach click handler
            // If its normal href, then the click event may fire twice, hence skip 
            //if (_neon.utils.isAnchor($parent) && ($parent.attr('href').indexOf('http://') <0)) {
            //    $parent.click({imgsrc: $el.attr('src')}, imageClickEventHandler);
            //}
            //var $topElement = _findAdjacentElementWithSameLink($el);
            //$ael =  $($topElement);
            //if ($ael)
            //  $ael.click({imgsrc: $el.attr('src')}, imageClickEventHandler);

        }
        catch(err) {
            // console.log('registerClick', err);
        }   
    }

    // image click event handler
    function imageClickEventHandler(e) {

        // Store the timestamp when an image was clicked
        // lastClickOnNeonElementTs = new Date().getTime();
        lastMouseClick = new Date().getTime();

        var imgSrc = e.data.imgsrc,
            offset = $(this).offset() // Get position relative to document
            wx = offset.left - $(window).scrollLeft(),
            wy = offset.top - $(window).scrollTop(),
            px = offset.left,
            py = offset.top,
            thumbData = thumbMap[imgSrc]
        ;

        // If the image is one that Neon cares about 
        if (typeof(thumbData) !== 'undefined') {
            _neon.utils.beacon('click hit', imgSrc);
            var vid = thumbData[0];
            var tid = thumbData[1];
           
            if (typeof(lastClickMap[tid]) !== 'undefined' && (lastMouseClick - lastClickMap[tid] < lastClickThreshold)) {
                return;
            }
            else {
                lastClickMap[tid] = lastMouseClick; 
            } 

            // send the mouse click event relative to the image (e.clientX,
            // e.clientY) 
            _neon.TrackerEvents.sendImageClickEvent(vid, tid, wx, wy, px, py, e.clientX, e.clientY);
        }
        else {
            _neon.utils.beacon('click miss', imgSrc);
            // May be send the img src as vid, to help track errors on resolving thumb data ?
            //_neon.TrackerEvents.sendImageClickEvent(encodeURIComponent(imgSrc), null, wx, wy, e.pageX, e.pageY);
        }
    }

    // Get thumbnail ids and video_id for images from URL
    function getNeonThumbnailIdsFromISP(videoIds, getThumbCallback) {

        if (videoIds.length < 1) {
            getThumbCallback(imgObjs, videoIds, '');
            return;
        }

        var publisherId = _neon.tracker.getNeonPublisherId(),
            serviceURL = 'http://' + apiBaseURL + '/v1/getthumbnailid/';

        serviceURL +=  publisherId + '.html?params=' + videoIds.join(); 

        var new_i_frame = document.createElement('iframe');
        $('body').append(new_i_frame);
        new_i_frame.style.display = 'none'; 
        new_i_frame.id = publisherId;
        new_i_frame.src = serviceURL;
    }

    function imageHunter (rootElement) {
        var $elements = _neon.utils.getElementsUsingImageSourceSelector('', rootElement);
        if ($elements.length > 0) {
           $elements.each(function() {
               _testAndAddImageElement(this);
           });  
        }
    }
    
    function getNewImages(element) {
        if (initialLoadComplete) {
            imageHunter(element);
        }
    } 
    
    // After the initial load, we want to set up an interval to submit to ISP 
    // for when new images are dynmanically added to the page, instead of firing 
    // it for each image
    function startISPSubmitInterval() { 
        setInterval(function() {
            _submitToISP(); 
        }, 2000);  
    } 
 
    // This function is fired, if the videoIds array has grown, it calls out to ISP 
    // and will end up in an event firing, from a separate window
    function _submitToISP() { 
        if (videoIds.length > videoIdsCount) { 
            getNeonThumbnailIdsFromISP(videoIds.slice(videoIdsCount, videoIds.length), startTrackingNeonISPImages);
            attachClickEventToHTML5VideoElement();
        }
        videoIdsCount = videoIds.length; 
    } 

    function _testAndAddImageElement(potentialElement) {
        var $element = _neon.utils.makeJQueryObject(potentialElement),
            url = _neon.utils.getMysteryElementImageSource($element);

        if (_isNeonThumbnail(url)) {
            var vid = _getNeonVideoIdFromURL(url);
            if ($.inArray(vid, videoIds) === -1) { 
                videoIds.push(vid);
                imgObjs.push($element);
            } 
            _registerClickEvent($element);
        }
    } 

    // Map ISP served images to Neon tids, used when images are served by ISP
    function mapImagesToTids() {
        imageHunter(document);
        initialLoadComplete = true; 
        _submitToISP();  
    }

    // Start Tracking Neon ISP Images
    // This is invoked as a callback after Neon ISP service call resolves
    // the video ids in to TIDs
    // Populate the thumb mappings
    window.startTrackingNeonISPImages = function startTrackingNeonISPImages(thumbnailIds) {
        if (thumbnailIds != '') {
            var tids = thumbnailIds.split(',');
            var ispMap = {};
            for (var i = trackerProcessedCount, j = 0; i < videoIds.length; i++, j++) {
                ispMap[videoIds[i]] = tids[j];
            }

            // Create the ThumbMap, URL => TID Map
            thumbMap = {};
            imgVisibleSizes = {};
            imgURLs = [];
            for (var i = trackerProcessedCount; i < imgObjs.length; i++) {
                var imgObj = imgObjs[i]
                    url = _neon.utils.getMysteryElementImageSource(imgObj);
                if (_isNeonImageServingURL(url)) {
                    var vid = _neonISPURLToVid(url);
                    thumbMap[url] = [vid, ispMap[vid]];
                }
                else {
                    thumbMap[url] = _parseNeonThumbnailIdURL(url);
                }
                imgURLs.push(url);
                // Populate the image sizes here
                imgVisibleSizes[url] = [imgObj.width(), imgObj.height()];
            }
            // Send the loaded image set that Neon is interested in 
            _neon.TrackerEvents.sendImagesLoadedEvent(thumbMap, imgVisibleSizes);
            // Start Tracking
            trackerProcessedCount = imgObjs.length;
            startTracking(imgURLs);
        }
    }

    // Is this a thumbnail Neon is interested in
    function _isNeonThumbnail(url) {
        if (typeof(url) === 'undefined')
            return false;

        if (url.indexOf('neontn') > -1 || url.indexOf('neonvid') > -1) {
            return true;
        }
        else {
            return false;
        }
    }

    // IS ISP URL? 
    function _isNeonImageServingURL(url) {
        if (typeof(url) === 'undefined') {
            return false;
        }
        if (url.indexOf('neonvid') > -1) {
            return true;
        }
        else {
            return false;
        }
    }

    function _trackLastMouseClick(e) {
        var elem,
            evt = e || event
        ;

        if (evt.srcElement) {
            elem = evt.srcElement;
        }
        else if (evt.target) {
            elem = evt.target;
        }

        var srcElementClick = elem.localName;
        lastClickOnNeonElement = srcElementClick;
        
        // If object then store click
        if (srcElementClick == 'object') {    
            lastClickOnNeonElementTs = new Date().getTime();
        }
    }

    // BIND to Page load event
    // This function runs at page load and maps all the images to their TIDs
    function initImageLoad() {
        $(window).bind('load', function() {
            mapImagesToTids();
            $(document).bind('DOMNodeInserted', function(e) {
                getNewImages(e.target);
            }); 
            startISPSubmitInterval();  
            // TODO: Figure out why this doesn't work always
            //document.onmouseup = _trackLastMouseClick; 
        });
    }

    // The main method that starts tracking the Images on the page
    
    function startTracking(imgUrls) {
        // for now, assuming all images on the page are thumbnails
        // basic visibility check
        // Add Appear event to all the images
        $('img').appear(); 
        var allVisibleSet = {}, //set of thumbnails that have been visible at least once 
            imagesSentSet = {}, //images sent to server
            forced = false,
            $imgArr = [],
            imgUrlsLength = imgUrls.length,
            i = 0
        ;
        for (; i < imgUrlsLength; i++) {
            var imageSource = imgUrls[i],
                $newElements = _neon.utils.getElementsUsingImageSourceSelector(imageSource, document)
            ;
            Array.prototype.push.apply($imgArr, $newElements);
            allVisibleSet[imageSource] = 0; // default to invisible
            imagesSentSet[imageSource] = 0; // default to not sent 
        }

        var lastVisibleSet = {}; // set of thumbnails visible currently

        // Every second, we get a list of images visible on the screen 
        // and compare with the last set.
        // If any new images have appeared, we add it to storage
        setInterval(function() {
            var newVisibleSet = {}; //set of thumbnails visible now
            var visibleSetChanged = false;

            // loop through all images on the page and check which of them are visible
            for (var i = 0; i < $imgArr.length; i++) {
                var $img = _neon.utils.makeJQueryObject($imgArr[i]);
                if ($img.is(':appeared')) {
                    var url = _neon.utils.getMysteryElementImageSource($img);
                    if (thumbMap.hasOwnProperty(url)) {
                        vidId = thumbMap[url][0];
                        thumbId = thumbMap[url][1];
                        if (!lastVisibleSet.hasOwnProperty(url)) { // image just appeared, store it
                            allVisibleSet[url] = 1;
                            // store the video_id-thumbnail_id pair as viewed
                            _neon.StorageModule.storeThumbnail(vidId, thumbId);
                        }
                        newVisibleSet[url] = 1; // add to the visible set
                        if (lastVisibleSet[url] !== 1) { 
                            visibleSetChanged = true;
                        }
                    }
                }
            }

            if (visibleSetChanged) {
                // update our set of currently visible thumbnails
                lastVisibleSet = newVisibleSet;
                var visibleThumbMap = [];
                for (var iUrl in allVisibleSet) {
                    if (allVisibleSet[iUrl] === 1) {
                        if (imagesSentSet[iUrl] === 0) {
                            imagesSentSet[iUrl] = 1;
                            visibleThumbMap.push(thumbMap[iUrl]);
                        }
                    }
                }
                if (visibleThumbMap.length > 0) {  
                    _neon.TrackerEvents.sendImagesVisibleEvent(visibleThumbMap);
                }
            }
        }, 1000); // Let's check every second

        // on window unload, send thumbnails viewed in the current session to the server
        $(window).bind('beforeunload', function() {
            // console.log("sending viewed thumbnails to server");
            var thumbnails = _neon.StorageModule.getAllThumbnails('session');
            // TODO: Send the Images visible event, when you have a Q 
        });
    }

    //////////////////////////////////////////////////////////////////////////////

    function parseTrackerAccountId() {
        // If TAI is embedded in the script, then set that
        if (typeof(neonPublisherId) !== 'undefined') {
           trackerAccountId = neonPublisherId;
           return;
        }

        // Else get TAI from the script (Backward compatability)
        var scriptTags = document.getElementsByTagName('script');
        for (var i = 0; i < scriptTags.length; i++) {
            sTag = scriptTags[i];

            // Backward compatibility
            if (sTag.src.search("neonbootloader") >= 0 || sTag.src.search("neonbctracker.js") >=0) {
                trackerAccountId = sTag.id;
            }
            if (sTag.src.search("neonoptimizer") >= 0) {
                trackerAccountId = sTag.src.split('_')[1].split('.js')[0];
            }
        }       
    }

    // NEON URL Regex 
    function _parseNeonThumbnailIdURL(imgurl) {
        var patt = new RegExp("neontn[A-Z,a-z,0-9,-]*_[A-Z,a-z,0-9,-,.]*_[A-Z,a-z,0-9,-]*");
        var res = patt.exec(imgurl);
        if (res) {    
            tid = res[0];
            var vid = tid.split('_')[1];
            return [vid, tid];
        }
    }
    
    // ISP URL to VID
    // http://i1.neon-images.com/v1/client/2145072359/neonvid_3747AbcXYZ.jpg?height=360&width=640";
    function _neonISPURLToVid(url) {
        var patt = new RegExp("neonvid_(?=.*\.jpg|\.png)([A-Z,a-z,0-9,_,-,.]*).(jpg|png)");
        var match = patt.exec(url); 
        return match[1];
    }

    function _getNeonVideoIdFromURL(url) {
       if (url.indexOf('neontn') > -1) {
            var ret = _parseNeonThumbnailIdURL(url);
            return ret[0];
       }

       if (url.indexOf('neonvid') > -1) {
           return _neonISPURLToVid(url);
       }
       return;
    }

    //////////////////////////////////////////////////////////////////////////////

    // public methods
    
    return {
        init: function() {
            initImageLoad();
            parseTrackerAccountId();
            //document.onmouseup = _trackLastMouseClick; 
        },

        // Get the Tracker AccountID from the script tag "id" field
        // Or from the filename of the optimizer script
        getTrackerAccountId: function() {
            return trackerAccountId; 
        },

        getTrackerType: function() {
            if (typeof(neonTrackerType) !== 'undefined') {
                return neonTrackerType; 
            }
            return "gen"; //default
        },

        getLastClickNeonElementTS: function() {
            return lastMouseClick;
            //return lastClickOnNeonElementTs;
        },

        getLastClickNeonElement: function() {
            return lastMouseClickElement;
            //return lastClickOnNeonElement;
        },

        // Only used by test method 
        setLastClickNeonElement: function(ele) {
            lastMouseClick = new Date().getTime();
            lastMouseClickElement = ele;
        },

        //getLastClickedImage: function() {
        //  return lastClickedImage;
        //},

        getNeonPublisherId: function() {
            return trackerAccountId; 
        },
        
        mapImagesToTids: mapImagesToTids,
        getNewImages: getNewImages,
        startISPSubmitInterval: startISPSubmitInterval

    };
    })();
    
    //// NEON STORAGE MODULE  /////
    
    _neon.StorageModule = (function() {
        var uidKey = 'uid',
        thumbMap, //stores a thumbnail url -> (videoId, thumbnailId) map
        thumbViewKeyPrefix = 'neonThumbnails', //key to localstorage which stores (video_ids, thumbnailIds) of viewed thumbnails
        keySeparator = "+" ; // + is a "SAFE" separator to generate key as it doesn't appear before ? 

    /// Private methods

    function _getDomain(url) {
        // expects url in the form of  "http://www.google.com";
        return url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/)[2];
    }

    function _getPageStorageKey(pageUrl, prefix) {
        if (typeof(prefix)==='undefined') {
            prefix = thumbViewKeyPrefix;
        }

        if (typeof(pageUrl) === 'undefined') {
            // Also clean up bookmarks "#"
            var pageURL = document.URL.split('?')[0]
                var key = prefix + keySeparator + pageURL; 
            return key; 
        }
        return prefix + keySeparator + pageUrl;
    }

    /// Store the image that was clicked in session storage
    /// This variable will be used to detect video plays without user action
    function _storeLastClickedImage(thumbId) {
        storageKey = _getPageStorageKey(document.URL.split('?')[0], "clickedThumbnail");
        sessionStorage.setItem(storageKey, JSON.stringify(thumbId));
    }

    function _getLastClickedThumbnail() {
        storageKey = _getPageStorageKey(document.URL.split('?')[0], "clickedThumbnail");
        var data = JSON.parse(sessionStorage.getItem(storageKey));
        if (data == false) { 
            return null;
        }
        else {
            return data;
        }
    }

    // Store thumbnails in storage 
    // Session storage: data is stored per page, keyed by page
    // Global thumbnail state is stored in local storage
    function _storeThumbnail(storage, vidId, thumbId) {
        var ts = parseInt((new Date().getTime()) / 1000, 10);

        if (storage == localStorage) {
            storageKey = thumbViewKeyPrefix;
        }
        else {
            storageKey = _getPageStorageKey();
        }

        var data = JSON.parse(storage.getItem(storageKey));
        if (!data) {
            data = {};
        }

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
        // console.log("Session:", storageKey, data, videoId);
        if (data) {
            return data[videoId];
        } else {
            return false;
        }
    }

    function _getThumbnailLocalStorage(vidId) {
        return _getThumbnail(localStorage, thumbViewKeyPrefix, vidId);
    }

    return {
        /// get the unique id
        getUid: function () {
            var uid = localStorage.getItem(uidKey);

            if (uid) { //if uid already exists
                return uid;
            } else { // create a unique id of length 10
                //we generate a highly randomized string to increase the probability of it being unique
                var ts = new Date().getTime(); //timestamp
                uid = _neon.utils.getRandomString(4) + _neon.utils.getRandomString(4) + ts.toString().substring(11, 13);
                localStorage.setItem(uidKey, uid);
                return uid;
            }
            // console.log(uid);
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
        getThumbnail: function(vidId, pageUrl) {
            // pageUrl == null, request thumbnail data on same page
            // pageUrl !null, look if data is session, then local
            var locRetrieved = "session";
            var storageKey = _getPageStorageKey(pageUrl);
            // console.log("Storage key: " + storageKey);
            var ret = _getThumbnail(sessionStorage, storageKey, vidId);
            if (ret) { //if found in session storage
                // console.log("accessing session storage data");
                return [ret, locRetrieved];
            } else { // check localstorage (user might have opened video in new tab)
                if (pageUrl) {
                    //If the domain of pageUrl and the document.url doesn't match return null
                    // console.log(_getDomain(document.URL)); 
                    // console.log(_getDomain(pageUrl));
                    if (_getDomain(document.URL) != _getDomain(pageUrl)) {
                        return null;
                    }
                }   
                // Create the image click event here, coz this was opened
                // in a new tab via right click->open 

                // Not a current session, hence get global state
                ret = _getThumbnailLocalStorage(vidId);
                //_neon.TrackerEvents.sendImageClickEvent(vidId, ret ? ret[0].thumbId : null);
                if (ret) {
                    locRetrieved = 'local';
                    return [ret, locRetrieved];
                }
                return null;
            }
        },

        // Helper method defined here so that we can unit test certain scenarios
        getThumbnailSessionStorage: function(vidId, pageUrl) {
            var storageKey = _getPageStorageKey(pageUrl);
            return _getThumbnail(sessionStorage, storageKey, vidId);
        },

        getThumbnailLocalStorage: function(vidId) {
            return _getThumbnailLocalStorage(vidId);
        },

        // Get all thumbnail data from particular storage
        getAllThumbnails: function (storage) {
            if (storage == 'session') {
                var pattern = new RegExp(thumbViewKeyPrefix);
                for(var i = 0; i < sessionStorage.length; i++) {
                    var key = sessionStorage.key(i);
                    // console.log("key == " + key);
                    // console.log(pattern);
                    if (pattern.test(key)) {
                        var data = sessionStorage.getItem(key);
                        return data;
                    }
                }
                return null;
            }
            else {
                return JSON.parse(localStorage.getItem(thumbViewKeyPrefix));
            }
        },

        // clear previous session data for the page 
        clearPageSessionData: function(pageUrl) {
            if (typeof(pageUrl) === 'undefined') {
                var pageUrl = document.URL.split('?')[0];
                var keyMatch = _getPageStorageKey(pageUrl);
                for(var i = 0; i < sessionStorage.length; i++) {
                    var key = sessionStorage.key(i);
                    // console.log("key : " + key + " ---> " + keyMatch);
                    if (key == keyMatch) {
                        // console.log("remove " + key);
                        sessionStorage.removeItem(key);
                    }
                }
            }       
        }
    }

    }());

    //////   End of storage module //////////

    ////// TRACKER Events sent to NEON //////////

_neon.TrackerEvents = (function() {
        var pageLoadId = _neon.utils.getPageRequestUUID(), 
            trackerAccountID,
            trackerType,
            pageUrl,
            referralUrl,
            timestamp,
            eventName,
            trackerURL = 'http://tracker.neon-images.com'
        ;
        // var trackerURL = 'http://private-9a3505-trackerneonlabcom.apiary-mock.com';

    function buildTrackerEventData(ts) {
        trackerAccountID = _neon.tracker.getTrackerAccountId();
        trackerType = _neon.tracker.getTrackerType();
        pageUrl = document.URL.split('?')[0];
        referralUrl = document.referrer.split('?')[0];
        var timestamp = new Date().getTime();
        if (typeof(ts) !== 'undefined') {
            timestamp = ts;
        }

        var request = trackerURL + '/v2/track?' + 'a=' + eventName + '&page=' + 
                    encodeURIComponent(pageUrl) + '&pageid=' + pageLoadId + 
                    '&ttype=' + trackerType + '&ref=' + encodeURIComponent(referralUrl) + 
                    '&tai=' + trackerAccountID + '&cts=' + timestamp;
        
        return request;
    }

    // convert ThumbMap to [tid1, tid2,....]
    function convertThumbMapToTids(tmap, imSizeMap) {
        var tids = [];
        for(var tm in tmap) { 
            if (tmap[tm]) {
                tid = tmap[tm][1];
                // If imSizeMap is given, then create a triplet of (tid,width,height)
                if (typeof(imSizeMap) !== 'undefined') {
                    tid += '+' + imSizeMap[tm][0] + '+' + imSizeMap[tm][1];
                }
                tids.push(tid);
            }
        }
        return tids;
    }

    return {
        // tid: thumbnail id
        // wx, wy: window xy coordinate
        // px, py: page xy coordinate
        // cx, cy: click event relative to the image
        sendImageClickEvent: function(vid, tid, wx, wy, px, py, cx, cy) {
            eventName = 'ic';
            var req = buildTrackerEventData();
            req += '&vid=' + vid + '&tid=' + tid;
            if (typeof(wx) !== 'undefined' && typeof(wy) !== 'undefined' && typeof(px) !== 'undefined' && typeof(py) !== 'undefined' && typeof(cx) !== 'undefined') {
                req += '&wx=' + wx + '&wy=' + wy + '&x=' + px + '&y=' + py + '&cx=' + cx + '&cy=' + cy;
            }
            _neon.utils.beacon(eventName, req);
            _neon.JsonRequester.sendRequest(req);
        },

        // PlayerID of the player, if available
        // adPlay, mediaPlay: Are timestamps  
        sendVideoPlayEvent: function(vid, tid, playerId, adPlay, adelta, pcount) {
            eventName = 'vp';
            var req = buildTrackerEventData();
            req += '&vid=' + vid + '&tid=' + tid + '&adPlay=' + 
                    adPlay + '&adelta=' + adelta + '&pcount=' + pcount;
            if (typeof(playerId) !=='undefined') {
                req += '&playerid=' + playerId;
            }
            _neon.utils.beacon(eventName, req);
            _neon.JsonRequester.sendRequest(req);
        },

        // If AD event available
        sendAdPlayEvent: function(vid, tid, playerId, adelta, pcount, adTs) {
            eventName = 'ap';
            var req = buildTrackerEventData(adTs);
            req += '&vid=' + vid + '&tid=' + tid + '&adelta=' + adelta + '&pcount=' + pcount;
            if (typeof(playerId) !=='undefined') {
                req += '&playerid=' + playerId;
            }
            _neon.utils.beacon(eventName, req);
            _neon.JsonRequester.sendRequest(req);
        },

        // ImageMap is a Map of thumbnail url => tid 
        sendImagesVisibleEvent: function(imageMap) {
            eventName = 'iv';
            var tids = convertThumbMapToTids(imageMap);
            var req = buildTrackerEventData();
            if (tids.length > 0) { 
                req += '&tids=' + tids;
                _neon.utils.beacon(eventName, tids.length, req);
                _neon.JsonRequester.sendRequest(req);
            }
        },

        // ImageMap is a Map of thumbnail url => tid
        // imSizeMap is map of url => visible im size 
        sendImagesLoadedEvent: function(imageMap, imSizeMap) {
            eventName = 'il';
            var tids = convertThumbMapToTids(imageMap, imSizeMap);
            var req = buildTrackerEventData();
            if (tids.length > 0) { 
                req += '&tids=' + tids;
                _neon.utils.beacon(eventName, tids.length, req);
                _neon.JsonRequester.sendRequest(req);
            }
        },

        // When user clicks on the thumbnail within the player
        sendVideoClickEvent: function(vid, tid, playerId) {
            eventName = 'vc';
            var req = buildTrackerEventData();
            req += '&vid=' + vid + '&tid='+ tid + '&playerid=' + playerId;
            _neon.utils.beacon(eventName, req);
            _neon.JsonRequester.sendRequest(req);
        },

        setPageLoadId: function(pId) {
            pageLoadId = pId;
        },

        getPageLoadId: function() {
            return pageLoadId;
        }

    }

}());
    //Main function
(function() {
    //We do not want the script to execute this main function while unit testing
    if(_neon.UNITTEST) return;

    var docReadyId = setInterval(NeonInit, 100); //100ms

    /// Neon Init method
    function NeonInit(){
        if(document.readyState === "complete" || document.readyState === "interactive"){
            //Clear the data on viewed thumbnails in session storage 
            //and update the TS in local storage	
            _neon.StorageModule.clearPageSessionData();
            clearInterval(docReadyId);

            /// IPAD Clicks
            $(document).bind("touchstart", function(e){
                // Record any touch start on the canvas (best effort)
                lastMouseClick = new Date().getTime();
            });

        }

    }

    /// TODO: Handle this globally and resort to storing things in memory
    //run the tracker only on browsers that can suppport it
    if(sessionStorage && localStorage && JSON) {
        _neon.tracker.init();
    }
})();

})(_neonjQuery); //end of _neon obj

