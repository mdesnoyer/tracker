
    ////// BRIGHTCOVE PLAYER TRACKER //////

    _neon.BCNeonPlayerTracker = (function(){
        var player = null, videoPlayer, playerId = null, content, exp, initialVideo, initialVideoId = null, adPlayTs = null, mediaPlay = null;
        var _newMedia = true, lastTid = null, playCount = 0, adPlay = false, adelta = null, _adPlayWithVidNull = false;
        var thumbMap = {}; // url => [VID, TID]
        var vidMap = {}; // VID => TID, location(player)  

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

        function addVideoToMap(vid, url){
            url = url.split('?')[0];
            var vmap = parseNeonBrightcoveUrl(url);
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
                    // for non ISP images
                    //var vmap = _neon.tracker.parseNeonBrightcoveUrl(url);
                    //if (vmap != null){
                    //    thumbMap[url] = vmap;
                    //    var vid = vmap[0];
                    //    var tid = vmap[1];
                    //    vidMap[vid] = [tid, "player"];	
                    //    _neon.StorageModule.storeThumbnail(vid, tid);
                    //}
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
