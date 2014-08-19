// Each custom module must be defined using the OO.plugin method
// The first parameter is the module name
// The second parameter is a factory function that will be called by
// the player to create an instance of the module. 
// This function must
// return a constructor for the module class

//TODO: Look at videocontext in ooyala video player 
//
OO.plugin("NeonTrackerModule", function (OO, _, $, W) {
    /**
     * Parameters:
     * OO, namespace for PlayerV3
     * _, reference to global _ object 
     * $, a reference to jQuery lib.
     * W, a reference to window object.
     * Use params to pass global params from the page
     */

    var NeonTracker = {};

    // A constructor for the module class
    // will be called by the player to create an instance of the module
    // First parameter is a reference to a message bus object, which
    // is required to be able to pub/sub to player events.
    // Second parameter is a unique id assigned to the module for 
    // debugging purposes
    NeonTracker.NeonTrackerModule = function (mb, id) {
        this.mb = mb; // save message bus reference for later use
        this.id = id;
	this.duration = NaN;
        this.playing = false;
	this.sentPlay = false;
        this.init(); // subscribe to relevant events
    };

    // public functions of the module object
    NeonTracker.NeonTrackerModule.prototype = {
        init: function () {
            // subscribe to relevant player events
            this.mb.subscribe(OO.EVENTS.PLAYER_CREATED, 'neonTracker',
            _.bind(this.onPlayerCreate, this));
            
	    this.mb.subscribe(OO.EVENTS.CONTENT_TREE_FETCHED,
                'neonTracker', _.bind(this.onContentReady, this));
			//PLAY
            
	    this.mb.subscribe(OO.EVENTS.PLAY, 'neonTracker',
            _.bind(this.onPlayerPlay, this));
	    
	    this.mb.subscribe(OO.EVENTS.PLAYBACK_READY, 'neonTracker',
            _.bind(this.onPlayerReady, this));
	    
	    this.mb.subscribe(OO.EVENTS.PLAYED, 'neonTracker',
            _.bind(this.onPlayerFinish, this));
	    

	    /// clear flag after video finished playing
	    
        },

		onPlayerFinish: function(event, x){
			this.sentPlay = false;
		},

		onPlayerReady: function(event, x){
			this.sentPlay = false;
			console.log("ready to play");
			      },

		onPlayerPlay: function(event, x, y){
			console.log(x);
		if(this.sentPlay == false){
			console.log("PLAY !!!");
			this.sentPlay = true;	
		}			
		}, 

        // Handles the PLAYER_CREATED event
        // First parameter is the event name
        // Second parameter is the elementId of player container
        // Third parameter is the list of parameters which were passed into
        // player upon creation.
        onPlayerCreate: function (event, elementId, params) {
            this.playerRoot = $("#" + elementId);
            this.rootElement = this.playerRoot.parent();
            console.log("hello, init here!!!", this.rootElement, this.id);
        },

        // content that was loaded into the player
        onContentReady: function (event, content) {
		console.log(content);
            this.duration = content.duration / 1000;
        },

    };

    // Return the constructor of the module class.
    // This is required so that Ooyala's player can instantiate the custom
    // module correctly.
    return NeonTracker.NeonTrackerModule;
});
