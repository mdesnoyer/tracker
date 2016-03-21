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
        _wormholeCount = 0,
        _DOM_PREFIX = 'neon-',
        _observer = undefined
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

    function _init (cid) {
        if (_storageAvailable('sessionStorage')) {
            console.log('Can use Tracker');
        }
        else {
            console.log('Cannot use Tracker');
            return false;
        }
        _clientId = cid;
        document.addEventListener('DOMContentLoaded', function(e) {
            console.log('DOMContentLoaded');
            _start(this.body);
            _scan(this.body);
        });
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    function _killCache() {
        sessionStorage.clear();
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

    function _processMutations(mutations) {
        mutations.forEach(_processMutation);
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
                console.log('Unknown Mutation ' + mutation.type);
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
        newIframe.setAttribute('id', _DOM_PREFIX + _wormholeCount++);
        newIframe.setAttribute('src', url);
        document.body.appendChild(newIframe);    
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    function _processMessage(data) {
        var _tempCache = _getCache();
        for (var cacheItem in _tempCache) {
            if (_tempCache.hasOwnProperty(cacheItem)) {
                if (_tempCache[cacheItem].tid === 'TODO') {
                    _tempCache[cacheItem].tid = data;
                }
            } 
        }
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    function _handleMessage(e) {
        var messageOrigin = e.origin;
        if (messageOrigin.indexOf(_API_BASE_URL) > -1) {
            _processMessage(e.data);
        }
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    function _end() {
        console.log('_end');
        _observer.disconnect();
        // kill the _eventer
        _killCache();
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    function _start(rootElement) {
        console.log('_start');
        var observer = new MutationObserver(_processMutations);
        observer.observe(rootElement, {
            attributes: true,
            childList: true,
            subtree: true
        });
        _observer = observer;
        _eventer(_messageEvent, _handleMessage, false);
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  
    return {
        init: _init,
        end: _end
    };

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

})();

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Bayard.init('1830901739');

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
