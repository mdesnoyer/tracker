var _neon=_neon||{},neonPageId=null,lastMouseClick,lastMouseClickElement;function _trackLastMouseClick(c){var a;c=c?c:event;c.srcElement?a=c.srcElement:c.target&&(a=c.target);lastMouseClickElement=a.localName;"object"==lastMouseClickElement&&(lastMouseClick=(new Date).getTime())}document.onmouseup=_trackLastMouseClick;Object.size=function(c){var a=0,k;for(k in c)c.hasOwnProperty(k)&&a++;return a};
(function(c){function a(){h=!1;for(var f in k){var d=c(k[f]).filter(function(){return c(this).is(":appeared")});d.trigger("appear",[d]);if(p){var b=p.not(d);b.trigger("disappear",[b])}p=d}}var k=[],m=!1,h=!1,q={interval:250,force_process:!1},e=c(window),p;c.expr[":"].appeared=function(f){f=c(f);if(!f.is(":visible"))return!1;var d=e.scrollLeft(),b=e.scrollTop(),l=f.offset(),a=l.left,l=l.top;return l+f.height()>=b&&l-(f.data("appear-top-offset")||0)<=b+e.height()&&a+f.width()>=d&&a-(f.data("appear-left-offset")||
0)<=d+e.width()?!0:!1};c.fn.extend({appear:function(f){var d=c.extend({},q,f||{});f=this.selector||this;if(!m){var b=function(){h||(h=!0,setTimeout(a,d.interval))};c(window).scroll(b).resize(b);m=!0}d.force_process&&setTimeout(a,d.interval);k.push(f);return c(f)}});c.extend({force_appear:function(){return m?(a(),!0):!1}})})(_neonjQuery);
(function(c){_neon.JsonRequester=function(){function a(c){this.fullUrl=c;this.noCacheIE="&noCacheIE="+(new Date).getTime();this.headLoc=document.getElementsByTagName("head").item(0);this.scriptId="JscriptId"+a.scriptCounter++}a.scriptCounter=1;a.prototype.buildScriptTag=function(){this.scriptObj=document.createElement("script");this.scriptObj.setAttribute("type","text/javascript");this.scriptObj.setAttribute("charset","utf-8");this.scriptObj.setAttribute("src",this.fullUrl+this.noCacheIE);this.scriptObj.setAttribute("id",
this.scriptId)};a.prototype.removeScriptTag=function(){this.headLoc.removeChild(this.scriptObj)};a.prototype.addScriptTag=function(){this.headLoc.appendChild(this.scriptObj)};return{sendRequest:function(c){try{bObj=new a(c),bObj.buildScriptTag(),bObj.addScriptTag()}catch(m){}}}}();_neon.utils={getRandomString:function(a){return parseInt(1E8*(1+Math.random()),10).toString().substr(0,a)},isHidden:function(a){return null===a.offsetParent?!0:!1},isAnchor:function(a){return"A"==a.prop("tagName")},sameSiteReferral:function(){var a=
document.referrer;-1!==a.indexOf("http://")?a=a.substr(7):-1!==a.indexOf("https://")&&(a=a.substr(8));return a==window.location.hostname},getPageRequestUUID:function(){for(var a="",c=16;0<c;--c)a+="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.round(61*Math.random())];return a},isOnScreen:function(a){a=c(a);var k=c(window),m=k.scrollTop(),h=k.scrollLeft(),q;q=h+k.width();var k=m+k.height(),e=a.offset();e.right=e.left+a.outerWidth();e.bottom=e.top+a.outerHeight();return!(q<e.left||
h>e.right||k<e.top||m>e.bottom)},getBackgroundImageUrl:function(a){a=c(a).css("background-image");a=a.replace("url(","").replace(")","");return a.substr(7)},getQueryValue:function(a,c){for(var m=a&&a.substring(1).split("&"),h=0,q=m.length;h<q;h++){var e=m[h],p=e.indexOf("=");if((e&&e.substring(0,p))===c)return e.substring(p+1,e.length)}}};_neon.tracker=function(){function a(){for(var b=document.getElementsByTagName("div"),f=b.length,a,d=[],c=0;c<f;c++)a=b[c],a.currentStyle?"none"!==a.currentStyle.backgroundImage&&
d.push(a):window.getComputedStyle&&"none"!==document.defaultView.getComputedStyle(a,null).getPropertyValue("background-image")&&d.push(a);return d}function k(b){lastMouseClick=(new Date).getTime();var a=b.data.imgsrc,d=c(this).offset();b=d.left-c(window).scrollLeft();var e=d.top-c(window).scrollTop(),g=d.left,d=d.top,a=f[a];"undefined"!==typeof a&&_neon.TrackerEvents.sendImageClickEvent(a[0],a[1],b,e,g,d)}function m(){var b=[],l={};c("img").each(function(){c(this);var a=c(this).attr("src");if(-1<
a.indexOf("neontn")){b.push(a);var f=c(this);$parent=f.parent();try{f.click({imgsrc:f.attr("src")},k),_neon.utils.isAnchor($parent)&&0>$parent.attr("href").indexOf("http://")&&$parent.click({imgsrc:f.attr("src")},k)}catch(d){console.log(d)}l[a]=[c(this).width(),c(this).height()]}});d=a();for(var n=0;n<d.length;n++){var h=_neon.utils.getBackgroundImageUrl(d[n]);b.push(h);l[h]=[c(this).width(),c(this).height()]}f=e(b);_neon.TrackerEvents.sendImagesLoadedEvent(f,l);q(b)}function h(){c(window).bind("load",
function(){m()})}function q(b){c("img").appear();for(var a={},n={},e=[],g=0;g<b.length;g++){var k=c('img[src$="'+b[g]+'"]');e.push(k);a[b[g]]=0;n[b[g]]=0}var h={};setInterval(function(){for(var b={},c=!1,k=0;k<e.length;k++){var g=e[k];g.is(":appeared")&&(g=g.attr("src"),f.hasOwnProperty(g)&&(vidId=f[g][0],thumbId=f[g][1],h.hasOwnProperty(g)||(a[g]=1,_neon.StorageModule.storeThumbnail(vidId,thumbId)),b[g]=1,c=!0))}for(k=0;k<d.length;k++)g=d[k],_neon.utils.isOnScreen(g)&&(g=_neon.utils.getBackgroundImageUrl(g),
f.hasOwnProperty(g)&&(vidId=f[g][0],thumbId=f[g][1],h.hasOwnProperty(g)||(a[g]=1,_neon.StorageModule.storeThumbnail(vidId,thumbId)),b[g]=1,c=!0));if(c){h=b;var b=[],m;for(m in a)1===a[m]&&0==n[m]&&(n[m]=1,b.push(f[m]));0<b.length&&_neon.TrackerEvents.sendImagesVisibleEvent(b)}},1E3);c(window).bind("beforeunload",function(){_neon.StorageModule.getAllThumbnails("session")})}function e(b){for(var a={},f=0;f<b.length;f++){var d=p(b[f]);d&&(a[b[f]]=d)}return a}function p(b){return-1<b.indexOf("neontn")?
(b=b.split("neontn")[1].split(".jpg")[0],[b.split("-")[1],b]):null}var f,d;return{init:function(){h()},getTrackerAccountId:function(){for(var b=document.getElementsByTagName("script"),a=0;a<b.length;a++)if(sTag=b[a],0<=sTag.src.search("neonbootloader")||0<=sTag.src.search("neonbctracker.js"))return sTag.id},getTrackerType:function(){return"brightcove"},getLastClickNeonElementTS:function(){return lastMouseClick},getLastClickNeonElement:function(){return lastMouseClickElement},setLastClickNeonElement:function(a){lastMouseClick=
(new Date).getTime();lastMouseClickElement=a},mapImagesToTids:m,parseNeonBrightcoveUrl:p}}();_neon.StorageModule=function(){function a(a){return a.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/)[2]}function c(a,d){"undefined"===typeof d&&(d=e);if("undefined"===typeof a){var b=document.URL.split("?")[0];return d+p+b}return d+p+a}function m(a,d,b){var l=parseInt((new Date).getTime()/1E3,10);storageKey=a==localStorage?e:c();var n=JSON.parse(a.getItem(storageKey));n||(n={});n[d]={thumbId:b,ts:l};a.setItem(storageKey,
JSON.stringify(n))}function h(a,d,b){return(a=JSON.parse(a.getItem(d)))?a[b]:!1}function q(a){return ret=h(localStorage,e,a)}var e="neonThumbnails",p="+";return{getUid:function(){var a=localStorage.getItem("uid");a||(a=(new Date).getTime(),a=_neon.utils.getRandomString(4)+_neon.utils.getRandomString(4)+a.toString().substring(11,13),localStorage.setItem("uid",a));return a},storeThumbnail:function(a,d){m(sessionStorage,a,d);m(localStorage,a,d)},getThumbnail:function(f,d){var b="session",l=c(d);return(l=
h(sessionStorage,l,f))?[l,b]:d&&a(document.URL)!=a(d)?null:(l=q(f))?[l,"local"]:null},getThumbnailSessionStorage:function(a,d){var b=c(d);return h(sessionStorage,b,a)},getThumbnailLocalStorage:function(a){return q(a)},getAllThumbnails:function(a){if("session"==a){a=new RegExp(e);for(var d=0;d<sessionStorage.length;d++){var b=sessionStorage.key(d);if(a.test(b))return sessionStorage.getItem(b)}return null}return JSON.parse(localStorage.getItem(e))},clearPageSessionData:function(a){if("undefined"===
typeof a){a=document.URL.split("?")[0];a=c(a);for(var d=0;d<sessionStorage.length;d++){var b=sessionStorage.key(d);b==a&&sessionStorage.removeItem(b)}}}}}();_neon.TrackerEvents=function(){function a(a){h=_neon.tracker.getTrackerAccountId();q=_neon.tracker.getTrackerType();e=document.URL.split("?")[0];p=document.referrer.split("?")[0];var b=(new Date).getTime();"undefined"!==typeof a&&(b=a);return"http://trackserver-test-691751517.us-east-1.elb.amazonaws.com/v2/track?a="+f+"&page="+encodeURIComponent(e)+
"&pageid="+m+"&ttype="+q+"&ref="+encodeURIComponent(p)+"&tai="+h+"&cts="+b}function c(a,b){var f=[],e;for(e in a)a[e]&&(tid=a[e][1],"undefined"!==typeof b&&(tid+="+"+b[e][0]+"+"+b[e][1]),f.push(tid));return f}var m=_neon.utils.getPageRequestUUID(),h,q,e,p,f;return{sendImageClickEvent:function(d,b,c,e,k,g){f="ic";var h=a(),h=h+("&vid="+d+"&tid="+b);"undefined"!==typeof c&&"undefined"!==typeof e&&"undefined"!==typeof k&&"undefined"!==typeof g&&(h+="&wx="+c+"&wy="+e+"&x="+k+"&y="+g);_neon.JsonRequester.sendRequest(h)},
sendVideoPlayEvent:function(d,b,c,e,h,g){f="vp";var k=a(),k=k+("&vid="+d+"&tid="+b+"&adPlay="+e+"&adelta="+h+"&pcount="+g);"undefined"!==typeof c&&(k+="&playerid="+c);_neon.JsonRequester.sendRequest(k)},sendAdPlayEvent:function(d,b,c,e,k,g){f="ap";g=a(g);g+="&vid="+d+"&tid="+b+"&adelta="+e+"&pcount="+k;"undefined"!==typeof c&&(g+="&playerid="+c);_neon.JsonRequester.sendRequest(g)},sendImagesVisibleEvent:function(d){f="iv";d=c(d);var b=a();_neon.JsonRequester.sendRequest(b+("&tids="+d))},sendImagesLoadedEvent:function(d,
b){f="il";var e=c(d,b),h=a();_neon.JsonRequester.sendRequest(h+("&tids="+e))},sendVideoClickEvent:function(d,b,c){f="vc";var e=a();_neon.JsonRequester.sendRequest(e+("&vid="+d+"&tid="+b+"&playerid="+c))},setPageLoadId:function(a){m=a}}}();_neon.BCNeonPlayerTracker=function(){function a(a,b){b=b.split("?")[0];var c=_neon.tracker.parseNeonBrightcoveUrl(b);null!=c&&(r[b]=c,a=c[0],c=c[1],t[a]=[c,"player"],_neon.StorageModule.storeThumbnail(a,c))}function c(a){var b=document.referrer.split("?")[0],d=null,
e=null,f;f=w&&2E3>=w?!1:!0;if(f){if(1==s&&""!=b){if(a=_neon.StorageModule.getThumbnail(a,b))d=a[0].thumbId,e=a[1];return[d,e]}return t[a]}if("object"==_neon.tracker.getLastClickNeonElement())return t[a];if(a=_neon.StorageModule.getThumbnail(a))return d=a[0].thumbId,e=a[1],[d,e]}function m(){var a={},b=x.getAllMediaCollections();if(0<b.length&&0<b[0].mediaCount){for(var c=0;c<b[0].mediaCount;c++)if(url=x.getMedia(b[0].mediaIds[c]).thumbnailURL,null!=url){url=url.split("?")[0];a[url]=[120,90];var d=
_neon.tracker.parseNeonBrightcoveUrl(url);if(null!=d){r[url]=d;var e=d[0],d=d[1];t[e]=[d,"player"];_neon.StorageModule.storeThumbnail(e,d)}}0<Object.size(r)&&(_neon.TrackerEvents.sendImagesVisibleEvent(r),_neon.TrackerEvents.sendImagesLoadedEvent(r,a))}}function h(a){!1==y&&(s+=1);vid=a.media.id;a=c(vid);var b=null,d=null;null!=a&&(b=a[0],d=a[1],"local"==d&&_neon.TrackerEvents.sendImageClickEvent(vid,b));_neon.TrackerEvents.sendVideoPlayEvent(vid,b,n,y,w,s);!0==A&&_neon.TrackerEvents.sendAdPlayEvent(vid,
b,n,w,s,B)}function q(a){if(z){z=!1;v=a=a.media.id;var b=t[a],c=null;b&&(c=b[0]);_neon.TrackerEvents.sendVideoClickEvent(a,c,n)}}function e(a){A=null==v?!0:!1;y=!0;B=(new Date).getTime();s+=1;if(!1==A){a=c(v);var b=null;a&&(b=a[0]);_neon.TrackerEvents.sendAdPlayEvent(v,b,n,w,s)}}function p(a){C=(new Date).getTime();z=!0;y=!1;v=a.media.id;var b=_neon.tracker.getLastClickNeonElementTS();b&&(w=C-b);v=a=a.media.id;var b=t[a],c=null;b&&(c=b[0]);_neon.TrackerEvents.sendVideoClickEvent(a,c,n)}function f(a){a=
a.split(",");for(var b=0;b<a.length;b++)playlist=a[b],x.getPlaylistByID(playlist,d)}function d(a){var b={};a=a.videos;for(var c=0;c<a.length;c++)if(url=a[c].thumbnailURL,null!=url){url=url.split("?")[0];b[url]=[120,90];var d=_neon.tracker.parseNeonBrightcoveUrl(url);if(null!=d){r[url]=d;var e=d[0],d=d[1];t[e]=[d,"player"];_neon.StorageModule.storeThumbnail(e,d)}}0<Object.size(r)&&(_neon.TrackerEvents.sendImagesVisibleEvent(r),_neon.TrackerEvents.sendImagesLoadedEvent(r,b))}var b=null,l,n=null,x,g,
u,v=null,B=null,C=null,z=!0,s=0,y=!1,w=null,A=!1,r={},t={};return{onTemplateReady:function(c){c.target.experience?(APIModules=brightcove.api.modules.APIModules,b?(l=b.getModule(APIModules.VIDEO_PLAYER),x=b.getModule(APIModules.CONTENT),g=b.getModule(APIModules.EXPERIENCE),l.addEventListener(brightcove.api.events.MediaEvent.BEGIN,h),l.addEventListener(brightcove.api.events.MediaEvent.PLAY,q),l.addEventListener(brightcove.api.events.MediaEvent.CHANGE,p),b.getModule(APIModules.ADVERTISING).addEventListener(brightcove.api.events.AdEvent.START,
e),l.getCurrentVideo(function(b){u=b;a(u.id,u.thumbnailURL)}),g.getExperienceID(function(a){n=a}),playerHtmlObject=document.getElementById(b.id),playlists=_neon.utils.getQueryValue(playerHtmlObject.data.split("?")[1],"%40playlistTabs"),f(playlists)):(APIModules=brightcove.api.modules.APIModules,g=c.target.experience.getModule(APIModules.EXPERIENCE),g.getExperienceID(function(a){n=a;l=g.experience.getModule(APIModules.VIDEO_PLAYER);l.addEventListener(brightcove.api.events.MediaEvent.BEGIN,h);l.addEventListener(brightcove.api.events.MediaEvent.PLAY,
q);l.addEventListener(brightcove.api.events.MediaEvent.CHANGE,p);g.experience.getModule(APIModules.ADVERTISING).addEventListener(brightcove.api.events.AdEvent.START,e)}))):(u=l.getCurrentVideo(),a(u.id,u.thumbnailURL))},onTemplateLoad:function(a){try{b=brightcove.api.getExperience(a)}catch(c){}null==b&&(b=bcPlayer.getPlayer(a),l=b.getModule(APIModules.VIDEO_PLAYER),g=b.getModule(APIModules.EXPERIENCE),n=g.getExperienceID(),x=b.getModule(APIModules.CONTENT),l.addEventListener(BCMediaEvent.BEGIN,h),
l.addEventListener(BCMediaEvent.PLAY,q),l.addEventListener(BCMediaEvent.CHANGE,p),g.addEventListener(BCExperienceEvent.CONTENT_LOAD,m),advertising=b.getModule(APIModules.ADVERTISING),advertising.addEventListener(BCAdvertisingEvent.AD_START,e))}}}();(function(){function a(){if("complete"===document.readyState||"interactive"===document.readyState)_neon.StorageModule.clearPageSessionData(),clearInterval(k),c(document).bind("touchstart",function(a){lastMouseClick=(new Date).getTime()}),NeonPlayerTracker=
_neon.BCNeonPlayerTracker}if(!_neon.UNITTEST){var k=setInterval(a,100);sessionStorage&&localStorage&&JSON&&_neon.tracker.init()}})()})(_neonjQuery);
