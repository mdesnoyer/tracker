// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

var Bayard = Bayard || (function () {

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    var _self = this,
        _clientId = '',
        _hasFirstAutoPlayHappened = false,
        _eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
        _eventer = window[_eventMethod],
        _messageEvent = _eventMethod === 'attachEvent' ? 'onmessage' : 'message',
        _API_BASE_URL = 'i3.neon-images.com',
        _messageCount = 0
    ;

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    function _storageAvailable(type) {
        try {
            var storage = window[type],
                x = '__storage_test__'
            ;
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        }
        catch(e) {
            return false;
        }
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    function init (cid) {
        if (_storageAvailable('sessionStorage')) {
            console.log('Can use Tracker');
        }
        else {
            console.log('Cannot use Tracker');
            return false;
        }
        _clientId = cid;
        document.addEventListener('DOMContentLoaded', function(event) {
            console.log('DOMContentLoaded');
            _start();
            _scan(document.body);
        });
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    function _setCache(newCache) {
        sessionStorage.setItem('_cache', JSON.stringify(newCache));      
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    function _getCache() {
        return JSON.parse(sessionStorage.getItem('_cache')) || {};
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    function _scan(rootElement) {
        var regExp = new RegExp(_clientId + '\/neonvid_([a-z0-9_,\-~\.]*)\.jpg', 'gi'),
            match,
            s = '',
            _tempCache = _getCache(),
            isCacheChanged = false,
            lookupVids = []
        ;
        if (typeof(rootElement) === 'object') {
            s = rootElement.innerHTML;
        }
        if (typeof(rootElement) === 'string') {
            s = rootElement;
        }
        if (s === '') {
            return;
        } 
        while (match = regExp.exec(s)) {
            var vid = match[1];
            console.log(vid);
            if (_tempCache && _tempCache.hasOwnProperty(vid)) {
                // leave _tempCache[vid] as is
            }
            else {
                isCacheChanged = true;
                lookupVids.push(vid);
                _tempCache[vid] = {
                    tid: 'TODO'
                };
            }
        }
        if (isCacheChanged === true) {
            _setCache(_tempCache);
            _getNeonThumbnailIdsFromISP(lookupVids);
        }
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    function _processMutation(mutation) {
        switch (mutation.type) {
            case 'childList':
                _scan(mutation.addedNodes[0]);
                break;
            case 'attributes':
                _scan(mutation.target.getAttribute(mutation.attributeName))
                break;
            default: 
                debugger;
                break;
        }
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    function _getNeonThumbnailIdsFromISP(videoIds) {
        var url = 'http://' + _API_BASE_URL + '/v1/getthumbnailid/' + _clientId + '.html?params=' + videoIds.join(),
            newIframe = document.createElement('iframe')
        ;
        newIframe.setAttribute('style', 'display: none');
        newIframe.setAttribute('id', 'message-' + _messageCount++);
        newIframe.setAttribute('src', url);
        document.body.appendChild(newIframe);    
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    function _start() {
        console.log('_start');
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(_processMutation);
        });
        observer.observe(document.body, {
            attributes: true,
            childList: true,
            subtree: true
        });
        _eventer(_messageEvent, function(e) {
            orig = e.origin;
            if (orig.indexOf(_API_BASE_URL) > -1) {
                debugger;
            }
        }, false);
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  
    return {
        init: init
    };

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

})();

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Bayard.init('1830901739');

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
