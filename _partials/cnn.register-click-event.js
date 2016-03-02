// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

var $elParent = $el.parent();
if ($elParent.is('a')) {
	$el = $elParent;
}

$elBonusEl = $($el.closest('.cd--card').find('.cd__headline a')[0]);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
