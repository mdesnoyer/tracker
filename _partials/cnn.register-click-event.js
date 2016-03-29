// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

var $elParent = $el.parent();

if ($elParent.is('a')) {
	$el = $elParent;
}

$elBonusEl1 = $($el.closest('.cd--card').find('.cd__headline a')[0]);
$elBonusEl2 = $($el.closest('.media__video').find('.media__video--thumbnail-wrapper')[0]);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
