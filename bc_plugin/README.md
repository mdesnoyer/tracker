# Neon Tracker for Brightcove Smart Player (Flash player)

Capture player events and send them to the Neon event tracking API.

## Reference
[Neon's tracking API definition] http://docs.trackerneonlabcom.apiary.io/#reference/tracking-events/video-play

## Description

The purpose of the plugin is to send tracking events to the Neon event tracker. It requires a <script> neonTrackerId = 123;</script> in the html. Here "123" is the publisher's Neon tracker account id. The plugin is enabled in a given player by placing a <Module> tag in the player's template BEML.xml when using Brightcove's Video Cloud Studio product. Edit the template and change the BEML to look something like:

```xml
<Runtime>
  <Theme name="Deluxe" style="Light"/>
  <Layout>
    <VBox padding="3">
      <VideoPlayer id="videoPlayer"/>
    </VBox>
  </Layout>
  <!-- begin Modules definition for loading tracker swf -->
  <Modules>
    <Module file="https://s3.amazonaws.com/neon-cdn-assets/plugins/brightcove-smart-tracker.swf"/>
  </Modules>
  <!-- end Modules definition -->
</Runtime>
```

## Installation

Install Apache mxmlc. Put its bin in your path. Run the deploy script.

```sh
bc_plugin/ $ deploy.sh
```

## Example

Run the Python web server from within bc_plugin/. Browse to http://localhost:8000/example/.

```sh
python -m SimpleHTTPServer
```

## Contact
Nate Kresge <kresge@neon-lab.com>
