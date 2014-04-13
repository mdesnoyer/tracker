// default-top.js
// Contains the following IGN.* objects:
//  -Storage
//  -Frogger
//  -Cookie
//  -RatingBox
//  -CommunityDiscussion
//  -Tabs
//  -Community
//  -ToolTip
//  -Indicies

/* MAKE SURE THIS IS COMMENTED OUT BEFORE GOING LIVE!!!!!
if(!window.console){
	console = {
		log : function(){
		}
	};
}
*/
// create Global IGN object
if(typeof IGN === "undefined" || !IGN) {
/*     	console.log("creating IGN namespace/object"); */     
	var IGN = {};
}
if(typeof window.$j === 'undefined' || window.$j){
	$j=jQuery.noConflict();
}

/********
 * Omniture Class
 *********/
IGN.omni ={
        omniTrackLink : function(sectionName, linkName) {
            var s=s_gi(s_account);
            s.linkTrackVars= 'prop15,eVar15,pageName,prop3,prop4,prop6,prop20,evar3,evar4,evar6,evar20';
            s.prop15=s.eVar15=linkName;
            s.tl(this, 'o', sectionName);
        }       
}


$j(document).ready(function(){
	/* fixes transparent PNGs for IE6 only
	 * there is no need for an extra check for ie6 since the function does
	 * that check for us already
	 */
	var ie55 = (navigator.appName == "Microsoft Internet Explorer" && parseInt(navigator.appVersion) == 4 && navigator.appVersion.indexOf("MSIE 5.5") != -1);
	var ie6 = (navigator.appName == "Microsoft Internet Explorer" && parseInt(navigator.appVersion) == 4 && navigator.appVersion.indexOf("MSIE 6.0") != -1);
	if ($j.browser.msie && (ie55 || ie6)) {
		$j.getScript('http://scripts.ign.com/game-profile/pngFix-patch.js', function(){ 
			$j('#logo, #logo-google, #footer-logo-ign').pngFix();
		});
	}
	
	/* Call to Further reading through ajax and dumps it in further reading div
	 */
	if($j("#further-reading").length > 0){
		var url = "./_views/ign/game_franchise.ftl?id="+gobId+"&network=12&context=true";
		$j.ajax({
				url: "/_views/ign/game_franchise.ftl?id="+gobId+"&network=12&context=true",
				type: "GET",
				cache: false,
				success: function(html, textStatus){
					$j("#further-reading").html(html);
				}
		});
	}
	//todo: need to add these into something...
	/* adds hover class to global nav links, nav dropdown options, and image thumbnails */
	// TODO: remove uneeded hovers
	$j(/*'#nav-global .nav-lnk,#nav-global .nav-dd,.nav-dd-menu-opt, .img-thumb,*/'.lb-highlight-img'/*,.nav-community-dd'*/).hover(function(){
		$j(this).addClass('hover');
	}, function(){
		$j(this).removeClass('hover');
	});

	/*************
	 * Omniture Events * 
	 ************/
	$j('a[omni_link]').click(function(e) {                    
		IGN.omni.omniTrackLink($j(this).parents('div[omni_section]').attr('omni_section'), $j(this).attr('omni_link'));
	});

	IGN.GlobalNav.init("nav-global", "nav-channel");
});
