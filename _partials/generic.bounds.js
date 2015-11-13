var $mysteryElement = $originalElement,
    $currentElement = $originalElement,
    mysteryElementInfo = $mysteryElement[0].getBoundingClientRect()
;
while (($currentElement = $currentElement.parent()) && ($currentElement[0] !== $(document.body)[0])) { // yuck
    if ($currentElement.css('overflow') === 'hidden') {
            var currentNodeInfo = $currentElement[0].getBoundingClientRect(),
                isOutOfBounds = (
                    mysteryElementInfo.right < currentNodeInfo.left
                    && mysteryElementInfo.bottom < currentNodeInfo.top
                    && mysteryElementInfo.left > currentNodeInfo.right
                    && mysteryElementInfo.top > currentNodeInfo.bottom
                )
        ;
        if (isOutOfBounds === true) {
            _neon.utils.beacon('isElementOutOfBounds', true);
            return true;
        }
        else {
            $mysteryElement = $currentElement;
        }
    }
    if ()
}
_neon.utils.beacon('isElementOutOfBounds', false);
return false;
},