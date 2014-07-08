// A script to profile the Imageservingplatform 
// Sends a request to image on page load and then sends the image load time to
// the tracker 

var NeonDataSender = (function() {
    var loadRequests = new Array();	
    //var NeonTrackerURL = "http://tracker.neon-lab.com/track";
    var NeonTrackerURL = "http://localhost:8888/";
    var NeonImageTestURL = "http://assets1.ignimgs.com/2014/06/30/bigby-wolfjpg-6e4fb8_160w.jpg"; 
    var start = null;

    function JSONscriptRequest(fullUrl) {
        this.fullUrl = fullUrl; 
        this.noCacheIE = '&noCacheIE=' + (new Date()).getTime();
        this.headLoc = document.getElementsByTagName("body").item(0);
        this.scriptId = 'JscriptId' + JSONscriptRequest.scriptCounter++;
    }

    JSONscriptRequest.scriptCounter = 1;
    JSONscriptRequest.prototype.buildScriptTag = function () {
        this.scriptObj = document.createElement("img");
        this.scriptObj.setAttribute("type", "image/jpeg");
        this.scriptObj.setAttribute("src", this.fullUrl + this.noCacheIE);
        this.scriptObj.setAttribute("id", this.scriptId);
        this.scriptObj.onload = NeonDataSender.handleCallback;
    };

    JSONscriptRequest.prototype.removeScriptTag = function () {
        this.headLoc.removeChild(this.scriptObj);  
    };

    JSONscriptRequest.prototype.addScriptTag = function () {
        start = (new Date()).getTime();
        this.headLoc.appendChild(this.scriptObj);
    }

    return{ 
        createImageRequest: function(){
            var req = NeonImageTestURL + "?"; 
            NeonDataSender.sendRequest(req);
        },

        sendRequest: function(req){
            try 
            { 
                bObj = new JSONscriptRequest(req); 
                bObj.buildScriptTag(); 
                bObj.addScriptTag();  
            }
            catch(err){
                console.log(err)
            }

        },

        handleCallback: function(jdata){
            // Send the round trip time + Image rendering on the page
            var diff = (new Date()).getTime() - start;
            console.log("JsonCallback ", diff);
        }

   }
}());

var docReadyId = setInterval(checkWindowReady, 100); //100ms
// Wait for doc ready and then fetch the image
function checkWindowReady(){
    if(document.readyState === "complete" || document.readyState === "interactive"){
        NeonDataSender.createImageRequest();
	    clearInterval(docReadyId);	

        var xmlhttp = new XMLHttpRequest();  
        if(xmlhttp)  
        {  
            var start = (new Date()).getTime();
            xmlhttp.onreadystatechange=function()  
            {  
                if (xmlhttp.readyState==4 && xmlhttp.status==200)  
                { 
                    var diff = (new Date()).getTime() - start;
                    console.log("Image downloaded ", diff); 
                }  
            } 
            var cURL = "http://neon-image-cdn.s3.amazonaws.com/test.jpg?x=1";
            xmlhttp.open("GET",cURL,false);  //cURL is the URL of image   
            xmlhttp.send() ;  
        }
    }

}
