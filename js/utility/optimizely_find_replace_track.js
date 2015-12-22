// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function neonTransform(neonReplacements) {
  // first navigate into the area where we want to look for matches
var $imageContainer = $('view-content');

  for (var key in neonReplacements) {
      var value = neonReplacements[key];    
      var $match = $imageContainer.find('a[href*="' + key + '"]');

      if ($match) {
          $match.each(function() {
          var $imgChild = $this.find("img");
          if ($imgChild) {
              $imgChild.each(function() {
                $this.attr('src', value);
              });
          } 
        });
      }
  }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

var neonReplacements = {
'http://www.fox.com/watch/585293379904/7716941568':'http://i1.neon-images.com/v1/client/1032156711/neonvid_FormationFlight.jpg',
'http://www.fox.com/second-chance/watch/573728835855/7765920768':'http://i3.neon-images.com/v1/client/1032156711/neonvid_HelloJetman.jpg'
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

neonTransform(neonReplacements);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

$(function(){var fileRef = document.createElement('script'); fileRef.setAttribute("type","text/javascript"); fileRef.setAttribute("src", "//neon-test.s3.amazonaws.com/neonoptimizer_1032156711.js"); document.body.appendChild(fileRef);});

window.neonInterval1 = setInterval(function() {
    if (window._neon !== undefined) {
      window._neon.tracker.masterControlProgram();
      clearInterval(neonInterval1);
    }
}, 200);


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
