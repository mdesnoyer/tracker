# How It Works

- Snippet included on page (contains a Publisher Id and a link to a script)
- This link is used to&nbsp;load a small Bootstrap&nbsp;JS file.</li><li>Bootstrap JS does a number of things:<ul>- Decache - remove any references to Neon images from cached copies and points back to the original
- Lazy loads jQuery (if it doesn&#39;t already exist in the project)
- Lazy loads in the Main JS
</ul></li><li>Main JS:<ol><li>There are three main events that are sent to reporting:<ul>- Image Load - when a Neon image is loaded
- Image View - when a Neon image comes into view (the viewport), this fires once for each image as we keep track of it being visible.
- Image Click - when a Neon image is clicked
</ul></li><li>The Tracker checks the DOM for nodes that contain Neon images.</li><li>The Tracker watches for new nodes that are added to the DOM. When they are, those nodes are checked for Neon images.</li><li>There is a blacklist of nodes that are not checked.</li><li>Neon images can be background, &lt;img&gt;, lazy loaded images (we check a number of common patterns)</li><li>Tracker can run in two slightly different ways.<ol><li>normal (default)<ul>- We add a click handler to each image that is served from the neon-images domain
- We fire an API call (batched where necessary) to work out the thumbnail_id and video_id (this is done via injecting a script tag / iframe to make a cross-domain request)
</ul></li><li>simple<ul>- <span style="background-color:rgba(251, 251, 251, 0); font-size:1.2em; letter-spacing:-0.7px; line-height:1.5em">adds a click handler to each anchor on the page</span>
- <span style="background-color:rgba(251, 251, 251, 0); font-size:1.2em; letter-spacing:-0.7px; line-height:1.5em"><span style="background-color:rgba(251, 251, 251, 0); font-size:1.2em; letter-spacing:-0.7px; line-height:1.5em">maintains a map of (anchor) url -&gt; thumbnail_id</span></span>
- <span style="background-color:rgba(251, 251, 251, 0); font-size:1.2em; letter-spacing:-0.7px; line-height:1.5em">when any anchor is clicked, the thumbnail_id and video_id is pulled from the map and used to register an Image Click</span>
</ul></li>
</li></ol></li></ol>