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

    /////// Tracker Methods ////////
    
    _neon.tracker = (function() {

        var trackerAccountId,
        uidKey = 'uid',
        thumbMap, //stores a thumbnail url => (videoId, thumbnailId) map of All Images (visible/ invisible)
        thumbViewKey = 'viewedThumbnails', //key to localstorage which stores (video_ids, thumbnailIds) of viewed thumbnails
        bgImageElArr = [], //array of elements which have background images
        lastClickedImage = null,
        lastClickOnNeonElementTs = null,
        lastClickOnNeonElement = null;

        // Maintain state & avoid the double click trigger issue
        var lastClickMap = {}; // Store the timestamp of a click for a given TID
        var lastClickThreshold  = 50; // 50ms

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
    // IGN case is handled in its own method 
    function _findAdjacentElementWithSameLink($el){
        $parent = $el.parent();
        var link = $parent.attr('href');
        var ret; 
        if(typeof(link) != 'undefined' && link != ""){
            var $gparent = $parent.parent().parent();
            var $ggparent = $parent.parent().parent().parent();
            // Only if its an Article TAG find all anchors for the children
            // Article tag is comon with publishers
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

    // Register click event to adjacent element of the image
    // IGN uses the following hirearchy
    // class="listElmnt" has 2 children -- listElmnt-thumb & listElmnt-blogItem
    // All clickable elements in here must be have a click handler registered
    function _registerClickEventToAdjacentElementWithSameLinkIGN($el){
        $parent = $el.parent();
        var link = $parent.attr('href');
        var ret; 
        if(typeof(link) != 'undefined' && link != ""){
            var $gparent = $parent.parent().parent(); // class listElmnt
            if($gparent.prop("class") == "listElmnt"){
                // Attach event to the anchor tag, so that click on play button
                // will produce an IC event
                var t = $($gparent.children()[0]);
                var at = t.find("a");
                at.click({imgsrc: $el.attr('src')}, imageClickEventHandler); 
                
                var x = $($gparent.children()[1]);
                // May cause double IC events
                //x.click({imgsrc: $el.attr('src')}, imageClickEventHandler); 
                // Attach event to listElemnt-thumb
                for (var i=0 ; i<x.length; i++){
                    if(x.prop("class") == "listElmnt-blogItem"){
                        var y = x.children();
                        for (var j=0; j<y.length; j++){
                            var z = $(y[j]).find("a");
                            for (var k=0; k<z.length; k++){
                                $(z[k]).click({imgsrc: $el.attr('src')}, imageClickEventHandler); 
                            }
                        }
                    }
                }
            }
        } 
    }

    // Register Neon Image click handler to the element, its parent & grandparent
    // Explore the use of onmouseup since onclick() may already be instrumented
    function _registerClickEvent($el){

        $parent = $el.parent();

        //Add image src as a function parameter
        try{
            if (typeof($el.attr('src')) === 'undefined'){
                $el.click({imgsrc: _neon.utils.getBackgroundImageUrl($el)}, imageClickEventHandler); 
                $parent.click({imgsrc: _neon.utils.getBackgroundImageUrl($el)}, imageClickEventHandler);
            }

            // Image click handler
            $el.click({imgsrc: $el.attr('src')}, imageClickEventHandler);
            
            // TEMP
            _registerClickEventToAdjacentElementWithSameLinkIGN($el);

            // If the parent is an anchor with JS, then attach click handler
            // If its normal href, then the click event may fire twice, hence skip 
            if(_neon.utils.isAnchor($parent) && ($parent.attr('href').indexOf('http://') <0))
                $parent.click({imgsrc: $el.attr('src')}, imageClickEventHandler);

            //var $topElement = _findAdjacentElementWithSameLink($el);
            //$ael =  $($topElement);
            //if($ael)
            //	$ael.click({imgsrc: $el.attr('src')}, imageClickEventHandler);

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

        // If background image, then window is this element, create dummy offset
        //if (typeof(offset) === 'undefined'){
        //    offset = {}; offset.left = 0; 
        //}
        var wx = offset.left - $(window).scrollLeft(); 
        var wy = offset.top - $(window).scrollTop();
        var px = offset.left;
        var py = offset.top;
        var thumbData = thumbMap[imgSrc];
        /// If the image is one that Neon cares about 
        if (typeof(thumbData) !== 'undefined'){
            var vid = thumbData[0];
            var tid = thumbData[1];
           
            if (typeof(lastClickMap[tid]) !== 'undefined' && (lastMouseClick - lastClickMap[tid] < lastClickThreshold)){
                return;
            }else{
                lastClickMap[tid] = lastMouseClick; 
            } 

            // send the mouse click event relative to the image (e.clientX,
            // e.clientY) 
            _neon.TrackerEvents.sendImageClickEvent(vid, tid, wx, wy, px, py, e.clientX, e.clientY);
        }else{
            // May be send the img src as vid, to help track errors on resolving thumb data ?
            //_neon.TrackerEvents.sendImageClickEvent(encodeURIComponent(imgSrc), null, wx, wy, e.pageX, e.pageY);
        }
    }

    // Get thumbnail ids and video_id for images from URL
    function getNeonThumbnailIdsFromISP(imgObjs, videoIds, publiserId, getThumbCallback){

        //assuming the url list is small enough to send as GET
        /*
           var serviceURL = 'http://neon.com/thumbnails/get/' + urls.join();
           $.getJSON(serviceURL, function(data) {
        //data will be an object like {url1: [vid_id, thumbnail_id], url2: [vid_id, thumbnail_id]}
        });
        */
        
        publisherId = "2089095449"; //IGN
        var serviceURL = 'http://i1.neon-images.com/v1/getthumbnailid/' ;
        serviceURL +=  publisherId + '/' + '?params=' + videoIds.join(); 

        // Make a service call
        var xmlhttp = new XMLHttpRequest(); 
        if(xmlhttp){ 
            var start = (new Date()).getTime();
            xmlhttp.onreadystatechange=function(){
                if (xmlhttp.readyState == 4){
                    if(xmlhttp.status == 200){
                        thumbCSV = xmlhttp.responseText;
                        getThumbCallback(imgObjs, videoIds, thumbCSV);
                    }else{
                        console.log("Service error", serviceURL);
                        // TODO: May be Beacon fallback ?
                    } 
                }  
            } 
        }
        xmlhttp.open("GET", serviceURL, true);
        xmlhttp.send();  
    }

    // Map ISP served images to Neon tids, Used when images are served by ISP
    function mapImagesToTids(){
        //batch all the thumbnail urls
        var videoIds = [];
        var imgObjs = [];

        // Iterate through Image tags
        $('img').each(function(){
            if(_isThumbnail($(this))) {
                var url = $(this).attr('src');
                //this url resolves to some thumbnail id
                if (_isNeonThumbnail(url)){
                    imgObjs.push($(this));
                    if(_isNeonImageServingURL(url)){
                        var vid = _getNeonVideoIdFromURL(url); 
                        videoIds.push(vid);
                    }
                    // Attach a click handler to the image and its parent
                    _registerClickEvent($(this));
                }
            }
        });
       
        //Elements with background images
        //Example: http://www.ign.com/articles/2014/04/15/mechrunner-coming-to-ps4-vita-and-pc
        bgImageElArr = getElementsWithBackgroundImages();
        for(var i=0; i<bgImageElArr.length; i++) {
            var el = bgImageElArr[i];
            var url = _neon.utils.getBackgroundImageUrl(el);
            if (_isNeonThumbnail(url)){
                imgObjs.push($(this));
                if(_isNeonImageServingURL(url)){
                    var vid = _getNeonVideoIdFromURL(url); 
                    videoIds.push(vid);
                }
                _registerClickEvent($(el));
            }
        }

        publisherId = _neon.tracker.getNeonPublisherId();
        getNeonThumbnailIdsFromISP(imgObjs, videoIds, publisherId, startTrackingNeonISPImages);
        
    }

    // Start Tracking Neon ISP Images
    // This is invoked as a callback after Neon ISP service call resolves
    // the video ids in to TIDs
    // Populate the thumb mappings
    function startTrackingNeonISPImages(imgObjs, videoIds, thumbnailIds){
        
        // temp
        var tids = thumbnailIds.split(',');
        var ispMap = {};
        for(var i=0; i<videoIds.length; i++)
            ispMap[videoIds[i]] = tids[i];

        // Create the ThumbMap, URL => TID Map
        thumbMap = {};
        imgVisibleSizes = {};
        imgURLs = [];
        for(var i=0; i<imgObjs.length; i++){
            var imgObj = imgObjs[i];
            var url = imgObj.attr('src');
            if(_isNeonImageServingURL(url)){
                var vid = _neonISPURLToVid(url);
                thumbMap[url] = [vid, ispMap[vid]];
            }else{
                thumbMap[url] = _parseNeonThumbnailIdURL(url);
            }
            imgURLs.push(url);
            // Populate the image sizes here
            imgVisibleSizes[url] = [imgObj.width(), imgObj.height()];
        }

        // Send the loaded image set that Neon is interested in 
        _neon.TrackerEvents.sendImagesLoadedEvent(thumbMap, imgVisibleSizes);
        
        // Start Tracking
        startTracking(imgURLs);
    }

    function _neonISPURLToVid(url){
        // TODO: regex
        var vid = url.split('/')[6].split('?')[0];
        vid = vid.split('_')[1];
        return vid;
    }


    // Is this a thumbnail Neon is interested in
    function _isNeonThumbnail(url){
        if(url.indexOf("neontn") > -1 || url.indexOf("neonvid") > -1)
            return true;
        else
            return false;
    }

    // IS ISP URL? 
    function _isNeonImageServingURL(url){
        //TODO: Regex
        if(url.indexOf("neonvid") > -1)
            return true;
        else
            return false;
    }

    /*
     * OLD mapImageToTids code, TODO: Cleanup 
    
    // NOTE: This method initiates the process of identifying images on the page 
    // Get the thumbnail IDs of all the images 
    // This is the regular mapper where the URLs have a NEON TID (neontn)
    function __mapImagesToTids(){
        //batch all the thumbnail urls
        var urls = [];
        var imgVisibleSizes = {};  
        //Image tags
        $('img').each(function(){
            if(_isThumbnail($(this))) {
                var url = $(this).attr('src');
                //this url resolves to some thumbnail id
                if (_isNeonThumbnail(url)){
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
            if (_isNeonThumbnail(url)){
                urls.push(url);
                imgVisibleSizes[url] = [$(this).width(), $(this).height()];
                _registerClickEvent($(el));
            }
            //console.log(url, $(el).width(), $(el).height());
        }

        //TODO: ThumbMAP to include the visible image size as well, currently we keep 2 maps
        thumbMap = getThumbMapForNeonThumbnails(urls);
        
        // Send the loaded image set that Neon is interested in 
        _neon.TrackerEvents.sendImagesLoadedEvent(thumbMap, imgVisibleSizes);
        startTracking(urls);
    }

    */

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
    // This function runs at page load and maps all the images to their TIDs
    function initImageLoad() {
        //wait for page load
        $(window).bind("load", function() {
            mapImagesToTids();
            //document.onmouseup = _trackLastMouseClick; 
        });
    }


    // The main method that starts tracking the Images on the page
    
    function startTracking(imgUrls){
        //for now, assuming all images on the page are thumbnails
        //basic visibility check
        //Add Appear event to all the images
        $('img').appear(); 
        var allVisibleSet = {}; //set of thumbnails that have been visible atleast once 
        var imagesSentSet = {}; //images sent to server

        var forced = false;
        //We check for the appearance of all images after a fixed interval
        var $imgArr = [];
        for(var i=0; i<imgUrls.length; i++) {
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
                        if(thumbMap.hasOwnProperty(url)){
                            vidId = thumbMap[url][0];
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
    function parseTrackerAccountId(){
        var scriptTags = document.getElementsByTagName("script");
        for (var i = 0; i<scriptTags.length; i++) {
            sTag = scriptTags[i];
            if(sTag.src.search("neonbootloader") >= 0 || sTag.src.search("neonbctracker.js") >=0){
                trackerAccountId = sTag.id;
            }
            if(sTag.src.search("neonoptimizer") >=0){
                trackerAccountId = sTag.src.split('_')[1].split('.js')[0];
            }
        } 		
    }

    /// Get Thumb map for thumbnails that Neon is interested in 
    function getThumbMapForNeonThumbnails(imgUrls){
        var ret = {};
        for(var i=0; i<imgUrls.length; i++){
            var val = parseNeontnURL(imgUrls[i]);
            if (val)
                ret[imgUrls[i]] = val;
            else{
                // Its an imageserving URL
            }
        }
        return ret;
    }

    function parseNeontnURL(imgUrl){
        //BCOVE URLs are of the form http://bcove/13_35_neontnAPIKEY_VID_TMD5.jpg?pb=13251 
        if (imgUrl.indexOf("neontn") > -1) {
            var parts = imgUrl.split('neontn')[1];
            var tid = parts.split('.jpg')[0];    
            var vid = tid.split('-')[1];
            return [vid, tid];
        }
        return null;
    }

    // Function to parse staing image urls with ?neontn=1 
    // Treat entire image basename as TID
    function parseIGNTemp(imgurl){
        if (imgurl.indexOf("neontn") > -1) {
            var parts = imgurl.split('?neontn')[0];
            parts = parts.split('/');
            //TODO: handle the _{compact} case for the thumb, write regex 
            var tid = parts[parts.length -1].split(".jpg")[0]; 
            var vid = tid.split('_')[0];
            return [vid, tid];
        } 

    }

    // NEON URL Regex 
    // @NOTE: Integrate this code  
    function _parseNeonThumbnailIdURL(imgurl){
        var patt = new RegExp("neontn[A-Z,a-z,0-9,-]*_[A-Z,a-z,0-9,-]*_[A-Z,a-z,0-9,-]*");
        var res = patt.exec(imgurl);
        if (res){    
            tid = res[0];
            var vid = tid.split('_')[1];
            return [vid, tid];
        }
    }

    function _getNeonVideoIdFromURL(url){
       if(url.indexOf("neontn") > -1){
            var ret = _parseNeonThumbnailIdURL(url);
            return ret[0];
       }

       if(url.indexOf("neonvid") > -1){
           var vid = url.split('/')[6].split('?')[0];
           vid = vid.split("_")[1];
           return vid;
       }
       return;
    }

    //////////////////////////////////////////////////////////////////////////////

    //public methods
    return {
        init: function() {
            initImageLoad();
            parseTrackerAccountId();
            //document.onmouseup = _trackLastMouseClick; 
        },

        // Get the Tracker AccountID from the script tag "id" field
        // Or from the filename of the optimizer script
        getTrackerAccountId: function(){
            return trackerAccountId; 
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

        getNeonPublisherId: function(){
            return trackerAccountId; 
        },

        mapImagesToTids: mapImagesToTids,
        parseNeontnURL: parseNeontnURL

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

        //var trackerURL = "http://tracker.neon-images.com";
        var trackerURL = "http://private-9a3505-trackerneonlabcom.apiary-mock.com";

    function buildTrackerEventData(ts){
        trackerAccountID = _neon.tracker.getTrackerAccountId();
        trackerType = _neon.tracker.getTrackerType();
        pageUrl = document.URL.split("?")[0];
        referralUrl = document.referrer.split('?')[0];
        var timestamp = new Date().getTime();
        if (typeof(ts) !== 'undefined')
            timestamp = ts;

        var request = trackerURL + "/v2/track?"+ "a=" + eventName + "&page=" + 
                    encodeURIComponent(pageUrl) + "&pageid=" + pageLoadId + 
                    "&ttype=" + trackerType + "&ref=" + encodeURIComponent(referralUrl) + 
                    "&tai=" + trackerAccountID + "&cts=" + timestamp;
        
        return request;
    }

    // convert ThumbMap to [tid1, tid2,....]
    function convertThumbMapToTids(tmap, imSizeMap){
        var tids = [];
        for(var tm in tmap){ 
            if (tmap[tm]){
                //tid = tmap[tm][1];
                tid = tmap[tm];
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
        // wx, wy: window xy coordinate
        // px, py: page xy coordinate
        // cx, cy: click event relative to the image
        sendImageClickEvent: function(vid, tid, wx, wy, px, py, cx, cy){
            eventName = "ic";
            var req = buildTrackerEventData();
            req += "&vid=" + vid + "&tid=" + tid;
            if(typeof(wx) !== 'undefined' && typeof(wy) !== 'undefined' && typeof(px) !== 'undefined' && typeof(py) !== 'undefined' && typeof(cx) !== 'undefined')
                req += "&wx=" + wx + "&wy=" + wy + "&x=" + px + "&y=" + py + "&cx=" + cx + "&cy=" + cy;
            _neon.JsonRequester.sendRequest(req);
        },

        // PlayerID of the player, if available
        // adPlay, mediaPlay: Are timestamps  
        sendVideoPlayEvent: function(vid, tid, playerId, adPlay, adelta, pcount){
            eventName = "vp";
            var req = buildTrackerEventData();
            req += "&vid=" + vid + "&tid=" + tid + "&adPlay=" + 
                    adPlay + "&adelta=" + adelta + "&pcount=" + pcount;
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
        },

        getPageLoadId: function(){
            return pageLoadId;
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
