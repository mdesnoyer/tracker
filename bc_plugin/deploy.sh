# Build and deploy swf plugin to S3
mxmlc \
  src/com/neon/plugins/BrightcovePlugin.as \
  -output dist/brightcove-smart-tracker.swf \
  -compiler.source-path src \
  -compiler.library-path lib && \
./upload_swf.py \
  -t s3prod
