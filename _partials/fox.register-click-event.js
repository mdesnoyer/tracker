// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

var $elParent = $el.parent();
if ($elParent.is('a.neonized-image')) {
	$el = $elParent;
}

// Try Mobile
$elBonusEl = $($el.closest('.views-row').find('.info .views-field-title a')[0]);

// Try Desktop
if ($elBonusEl.length === 0) {
	$elBonusEl = $($el.closest('.fox-video-full-episodes-listing').find('.views-field-title a')[0]);
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -