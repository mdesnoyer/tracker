package {

    import com.brightcove.api.APIModules;
    import com.brightcove.api.CustomModule;
    import com.brightcove.api.components.TileList;
    import com.brightcove.api.dtos.VideoDTO;
    import com.brightcove.api.events.AdEvent;
    import com.brightcove.api.events.MediaEvent;
    import com.brightcove.api.modules.AdvertisingModule;
    import com.brightcove.api.modules.ExperienceModule;
    import com.brightcove.api.modules.MenuModule;
    import com.brightcove.api.modules.VideoPlayerModule;

    import flash.display.Loader;
    import flash.display.Stage;
    import flash.events.MouseEvent;
    import flash.net.URLRequest;
    import flash.external.ExternalInterface;
    import flash.system.Security;


    public class neonoptimizer extends CustomModule
    {
        private var _experienceModule:ExperienceModule;
        private var _videoPlayerModule:VideoPlayerModule;
        private var _advertisingModule:AdvertisingModule;
        private var _currentVideo:VideoDTO;
        private var _currentPosition:Number;
        private var _menuModule:MenuModule;

        private var _mediaBegin:Boolean = false;
        private var _mediaComplete:Boolean = true;
        private var _imageURL:String = "";
        private var _thumbURL:String = "";
        private var _bns:String = "";
        private var _refURL:String = "";
        private var _pageURL:String = "";
        private var _pageid:String = "";
        private var _adPlayed:Boolean = false;
        private var _calledVP:Boolean = false;
        private var _accountID:String = "557414715";
        private var _start:Number = 0;
        private var _vidCount:Number = 1;
        private var _calledImageClick:Boolean = false;
        private var refToStage:Stage;
        private var adelta:Number = -1;
        private var lclick:Number = -1;
        private var mediaPlay:Number;
        private var adPlay:Number;
        private var _tileList:TileList;
        private var _numColumns:int;
        private var _currTileListPage:int;
        private var _tileListCount:int;
        private var _ivCalled:Array;

        public function neonoptimizer() : void {}

        protected function getConfigFromExternalInterface() : Object
        {
            ExternalInterface("console.log(neonPublisherId)");
            return {};
        }

        override protected function initialize() : void
        {
            trace("start plugin initialize");
            Security.allowDomain("s3.amazonaws.com");

            _experienceModule = player.getModule(APIModules.EXPERIENCE) as ExperienceModule;
            _videoPlayerModule = player.getModule(APIModules.VIDEO_PLAYER) as VideoPlayerModule;
            _advertisingModule = player.getModule(APIModules.ADVERTISING) as AdvertisingModule;
            _menuModule = player.getModule(APIModules.MENU) as MenuModule;

            // This handles setting the lclick value for the play button or overlay PLAY button clicks
            refToStage = _experienceModule.getStage();
            refToStage.addEventListener(MouseEvent.CLICK, onMouseClick);
            setupEventListeners();

            _currentVideo = _videoPlayerModule.getCurrentVideo();
            _imageURL = _currentVideo.videoStillURL;

            _pageid = genNumber(16);
            _refURL = encodeURIComponent(_experienceModule.getReferrerURL());

            ExternalInterface.call("console.log", "expMod: " + _experienceModule.toString());
            ExternalInterface.call("console.log", "refURL: " + _refURL);
            //neontn in the name is a VC stored image URL, fully resolved (neontn... .)
            //neonvid in the name is ISP (either neonvid... .jpg OR neonvid... ?)

            _pageURL = encodeURIComponent(_experienceModule.getExperienceURL());
            _start = returnStart(_imageURL);
            ExternalInterface.call("console.log", "_pageURL" + _pageURL)
            ExternalInterface.call("console.log", "_start" + _start)

            _tileList = _experienceModule.getElementByID("videoList") as TileList;
            if (_tileList != null) {
                _tileListCount = _tileList.getNumItems();
                var _numPages:Number = _tileList.getNumPages();

                _ivCalled = new Array(_tileList.getNumPages());
                _numColumns = _tileList.getColumnCount();

                var bns:String = "";
                var bnsForIV:String = "";

                // time to call all the il's and the first set of iv's
                for (var i:int = 0; i < _tileListCount; i++){
                    var video:VideoDTO = _tileList.getDataAtIndex(i) as VideoDTO;
                    if (video != null) {
                        _thumbURL = video.thumbnailURL;
                        var _neonThumb:Number = returnStart(_thumbURL);

                        if (_neonThumb > -1) {
                            var _neonEnd:Number = returnEnd(_thumbURL, _neonThumb);

                            if (_neonEnd == -1) {
                                _neonEnd = _thumbURL.length;
                            }
                            var height:Number = _tileList.getRowHeight();
                            var width:Number = _tileList.getColumnWidth();
                            if (i < _tileListCount-1) {
                                bns = bns + _thumbURL.slice(_neonThumb, _neonEnd) + "+" + width + "+" + height + ",";
                            } else {
                                bns = bns + _thumbURL.slice(_neonThumb, _neonEnd) + "+" + width + "+" + height;
                            }
                            if (i < _numColumns-1) {
                                bnsForIV = bnsForIV + _thumbURL.slice(_neonThumb, _neonEnd) + ",";
                            } else if (i == _numColumns-1) {
                                bnsForIV = bnsForIV + _thumbURL.slice(_neonThumb, _neonEnd);
                            }
                        }
                    }
                }

                if (bns.charAt(bns.length-1) == ",") {
                    bns = bns.slice(0,bns.length-1);
                }

                if (bnsForIV.charAt(bnsForIV.length-1) == ",") {
                    bnsForIV = bnsForIV.slice(0,bnsForIV.length-1);
                }

                // Load the appropriate carousel il's and iv's IF we have "neonvid" thumbs, remember that we called iv's for pageset 0 in the carousel
                if (bns != "") {
                    loadTrackingimage("il", "bns=" + bns);
                }

                if (bnsForIV != "") {
                    loadTrackingimage("iv", "bns=" + bnsForIV);
                }

                _ivCalled[0] = true;

                _currTileListPage = _tileList.getPageIndex();
                //_tileList.addEventListener(BEMLMouseEvent.CLICK, onTileListClick);
                _tileList.addEventListener(MouseEvent.CLICK, onTileListClick);
            }

            ExternalInterface.call("console.log", "refURL.lenth: " + _refURL.length);
            ExternalInterface.call("console.log", "refURL.type: " + typeof(_refURL));

            // Now take care of the non carousel based player's 1 il & iv call
            if (_start > 0 && _tileList == null) {
                var end:Number = returnEnd(_imageURL, _start);

                if (end == -1) {
                    end = _imageURL.length;
                }
                _bns = _imageURL.slice(_start,end);
                height = _experienceModule.getHeight();
                width = _experienceModule.getWidth();
                loadTrackingimage("il", "bns=" + _bns + "+" + width + "+" + height);
                loadTrackingimage("iv", "bns=" + _bns);
            }
        }

        private function returnStart(url:String) : Number {
            var startPos:Number = url.indexOf("neontn");
            if (startPos == -1) {
                startPos = url.indexOf("neonvid");
            }
            return startPos;
        }

        private function returnEnd(url:String, startPos:Number) : Number {
            var endPos:Number = url.indexOf(".", startPos);
            if (endPos == -1) {
                endPos = url.indexOf("?", startPos);
            }

            return endPos;
        }

        private function onTileListClick(pEvent:MouseEvent) : void {
            var newPageNum:int =_tileList.getPageIndex();
            var video:VideoDTO;

            ExternalInterface.call("console.log", "onTileListClick, got a click and our pageNum is now: " + newPageNum);

            if (newPageNum != _currTileListPage) {
                _currTileListPage = newPageNum;
                var ivBNs:String = "";
                ExternalInterface.call("console.log", "onTileListClick, new page num <> currPageNum");

                // if we haven't called that pages' iv's, call them
                if (_ivCalled[_currTileListPage] == undefined) {
                    // change to numColumns
                    for (var i:int = 0; i < _numColumns; i++) {
                        if ((_currTileListPage*_numColumns)+i < _tileListCount) {
                            video = _tileList.getDataAtIndex((_currTileListPage*_numColumns)+i) as VideoDTO;
                            if (video != null) {
                                var thumbString:String = video.thumbnailURL;
                                var _foundNeon:Number = returnStart(thumbString);

                                if (_foundNeon > -1) {
                                    var _neonEnd:Number = returnEnd(thumbString, _foundNeon);
                                    ivBNs = ivBNs + thumbString.slice(_foundNeon, _neonEnd) + ",";
                                }
                            }
                        }
                    }
                    // TODO: Switch to Sunil's method of stacking BNs, so we don't have to slice off last comma.
                    var iv:String = ivBNs.slice(0, ivBNs.length-1);
                    loadTrackingimage("iv", "bns=" + iv);
                    _ivCalled[_currTileListPage] = true;
                }

            } else {
                // page number was the same, this should be a video click on something that isn't currently loaded / playing.
                video = _tileList.getSelectedData() as VideoDTO;
                ExternalInterface.call("console.log", "onTileListClick, vid to switch to = " + video.id + ", name :" + video.displayName);
                ExternalInterface.call("console.log", "onTileListClick, currVideo = " + _currentVideo.id);

            }

        }

        private function loadTrackingimage(tracktype:String,restOfURL:String) : void {
            var myDate:Date = new Date();
            var cts:Number = myDate.getTime() + (myDate.getTimezoneOffset() * 60000);
            var completeURL:String = "http://tracker.neon-images.com/v2/track";
            //var completeURL:String = "http://private-ec864-trackerneonlabcom.apiary-mock.com/v2/track";

            if ((_refURL.length) > 20) {
                completeURL+= "?a=" + tracktype + "&pageid=" + _pageid + "&tai=" + _accountID + "&ttype=brightcove&page=" + _pageURL + "&ref=" + _refURL + "&cts=" + cts + "&" + restOfURL;
            } else {
                completeURL+= "?a=" + tracktype + "&pageid=" + _pageid + "&tai=" + _accountID + "&ttype=brightcove&page=" + _pageURL + "&cts=" + cts + "&" + restOfURL;
            }

            var urlRequestOne:URLRequest = new URLRequest(completeURL);
            var loaderOne:Loader = new Loader();
            loaderOne.load(urlRequestOne);
            addChild(loaderOne);
        }

        private function autoPlayVideo() : Boolean {
            ExternalInterface.call("console.log", "in onAutoPlay() : adelta -> " + adelta);
            if(adelta >-1 && adelta <= 2000) {
                return false;
            } else {
                _calledImageClick = true; // if autoplay we should never send an ic
            }
            return true;
        }

        private function onMouseClick(pEvent:MouseEvent) : void {
            var mydate:Date = new Date();
            lclick = mydate.getTime() + (mydate.getTimezoneOffset() * 60000);
        }

        private function genNumber(maxsize:int):String {
            var ranstring:String = "";
            var charPool:String = "abcdefghijklmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ234567890";
            var randomNumberUnder100:int;
            for (var i:int=0; i < maxsize; i++) {
                randomNumberUnder100 = Math.floor((Math.random() * 100));
                var position:int = randomNumberUnder100 % (charPool.length-1);
                ranstring += charPool.charAt(position);
            }
            return ranstring;
        }

        private function setupEventListeners() : void {
            _videoPlayerModule.addEventListener(MediaEvent.CHANGE, onMediaChange);
            _videoPlayerModule.addEventListener(MediaEvent.BEGIN, onMediaBegin);
            _videoPlayerModule.addEventListener(MediaEvent.PLAY, onMediaPlay);
            _videoPlayerModule.addEventListener(MediaEvent.COMPLETE, onMediaComplete);

            if(_advertisingModule) { //check to make sure ads are enabled first
                _advertisingModule.addEventListener(AdEvent.AD_START, onAdStart);
            }
        }

        private function onMediaBegin(pEvent:MediaEvent) : void {
            if(!_mediaBegin) {
                _mediaComplete = false;
                _mediaBegin = true;
            }
        }

        private function onMediaPlay(pEvent:MediaEvent) : void {
            var mydate:Date = new Date();
            mediaPlay = mydate.getTime() + (mydate.getTimezoneOffset() * 60000);

            if(!_mediaBegin) {
                //PD videos don't fire mediaPlay when the video starts the first time around, so we'll track it manually
                onMediaBegin(pEvent);
            }

            if (adelta == -1 && lclick > -1) {
                adelta = mediaPlay - lclick;
            }

            ExternalInterface.call("console.log", "onMediaPlay : calledImageClickAlready? -> " + _calledImageClick + ", _start -> " + _start + ", mediaPlay -> " + mediaPlay + ", adelta -> " + adelta + ", lclick -> " + lclick);

            _bns = "";
            var video:VideoDTO = _videoPlayerModule.getCurrentVideo();
            var thumb:String = video.thumbnailURL;
            var icStart:Number = returnStart(thumb);

            if (icStart > -1) {
                var icEnd:Number = returnEnd(thumb, icStart);

                if (icEnd == -1) {
                    icEnd = thumb.length;
                }
                _bns = thumb.slice(icStart, icEnd);
                //ExternalInterface.call("console.log", "onMediaPlay, setting _bns to = " + _bns);

                if (!autoPlayVideo()) {
                    if (!_calledImageClick) {
                        loadTrackingimage("ic","bn=" + _bns);
                        _calledImageClick = true;
                    }
                }
                if (!_calledVP) {
                    if (adelta == -1) {
                        loadTrackingimage("vp", "bn=" + _bns + "&vid=" + _currentVideo.id + "&playerid=" + _experienceModule.getExperienceID() + "&adplay=" + _adPlayed + "&adelta=null&pcount=" + _vidCount);
                    } else {
                        loadTrackingimage("vp", "bn=" + _bns + "&vid=" + _currentVideo.id + "&playerid=" + _experienceModule.getExperienceID() + "&adplay=" + _adPlayed + "&adelta=" + adelta + "&pcount=" + _vidCount);
                    }
                    _calledVP = true;
                }
            }
        }

        /**
         * This gets fired from the onMediaProgress handler and not from the Player API. Also
         * tracks the total time watched by the user for the video.
         */
        private function onMediaComplete(pEvent:MediaEvent) : void {
            if(!_mediaComplete) {
                _mediaComplete = true;
                _mediaBegin = false;
            }
        }

        private function onMediaChange(pEvent:MediaEvent) : void {
            _currentVideo = _videoPlayerModule.getCurrentVideo();
            //ExternalInterface.call("console.log", "onMediaChange happened");
            _calledImageClick = false;
            _calledVP = false;
            adelta = -1;
            _vidCount++;
            var mydate:Date = new Date();
            mediaPlay = mydate.getTime() + (mydate.getTimezoneOffset() * 60000);

        }

        private function onAdStart(pEvent:AdEvent) : void {
            var mydate:Date = new Date();
            adPlay = mydate.getTime() + (mydate.getTimezoneOffset() * 60000);

            if (adelta == -1 && lclick > -1) {
                adelta = adPlay - lclick;
            }

            _bns = "";
            var video:VideoDTO = _videoPlayerModule.getCurrentVideo();
            var thumb:String = video.thumbnailURL;
            var icStart:Number = returnStart(thumb);

            _adPlayed = true;
            if (icStart > -1) {
                var icEnd:Number = returnEnd(thumb, icStart);

                if (icEnd == -1) {
                    icEnd = thumb.length;
                }
                _bns = thumb.slice(icStart, icEnd);
                //ExternalInterface.call("console.log", "onAdSTart, setting _bns to = " + _bns);

                if (!autoPlayVideo()) {
                    if (!_calledImageClick) {
                        loadTrackingimage("ic","bn=" + _bns);
                        _calledImageClick = true;
                    }
                }
                if (adelta == -1) {
                    loadTrackingimage("ap", "bn=" + _bns + "&vid=" + _currentVideo.id + "&playerid=" + _experienceModule.getExperienceID() + "&adelta=null&pcount=" + _vidCount);
                } else {
                    loadTrackingimage("ap", "bn=" + _bns + "&vid=" + _currentVideo.id + "&playerid=" + _experienceModule.getExperienceID() + "&adelta=" + adelta + "&pcount=" + _vidCount);

                }

            }
        }
    }
}
