// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

var neonReplacements = {
    'X': 'Y'
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function neonTransform(neonReplacements) {
    var $imageContainer = $('body');
    for (var key in neonReplacements) {
        var value = neonReplacements[key],
            $matches = $imageContainer.find('img[src*="' + key + '"]')
        ;
        $matches.each(function() {
            $(this).attr('src', value);
        });
    }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

neonTransform(neonReplacements);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

$(function() {
    var fileRef = document.createElement('script');
    fileRef.setAttribute('type', 'text/javascript');
    fileRef.setAttribute('src', '//neon-test.s3.amazonaws.com/neonoptimizer_603225904.js');
    document.body.appendChild(fileRef);
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

window.neonInterval1 = setInterval(function() {
    if (window._neon !== undefined) {
        window._neon.tracker.masterControlProgram();
        clearInterval(neonInterval1);
    }
}, 500);


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
