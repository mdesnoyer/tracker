/* 11:38:31 02/04/2013 [http://oystatic.ignimgs.com/src/core/js/widgets/global/page/newslettersignup.js]*/
(function(){$(document).ready(function(){function c(a){a=a.replace(/^\s+/,"");return a=a.replace(/\s+$/,"")}$("#newsletter-sign-up").submit(function(){$(this).find(".error").remove();var a;a=$("#newsletter-sign-up").find(".email-input")[0];var b;b=/^[0-9a-zA-Z\-\_.]+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;a=""==a.value||!b.test(c(a.value))?!1:!0;return!a?($(".email-submit").after('<span class="error">Please enter a valid email!</span>'),!1):!0})})})(jQuery);
