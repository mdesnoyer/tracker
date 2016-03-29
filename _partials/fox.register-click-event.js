// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

var $elParent = $el.parent();
if ($elParent.is('a.neonized-image')) {
	$el = $elParent;
}

// Try Mobile
$elBonusEl1 = $($el.closest('.views-row').find('.info .views-field-title a')[0]);

// Try Desktop
if ((typeof $elBonusEl1 != 'undefined') && ($elBonusEl1.length === 0)) {
	$elBonusEl1 = $($el.closest('.fox-video-full-episodes-listing').find('.views-field-title a')[0]);
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -