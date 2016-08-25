// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// Special case for data-src, we need to search the JSON for a result, but only
// if the src is not already a neon thumbnail, HACK
if (!_neon.tracker.isNeonThumbnail($el.attr('src')) && $el.attr('data-src')) {
    var tempObject = JSON.parse($el.attr('data-src'));
    if (tempObject && tempObject.hasOwnProperty('default')) {
        return tempObject['default'];
    }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
