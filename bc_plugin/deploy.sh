# Build and deploy swf plugin to S3
mxmlc \
  src/neonoptimizer.as \
  -o dist/brightcove-smart-tracker.swf \
  -compiler.library-path lib && \
./upload_swf.py \
  -t s3prod
