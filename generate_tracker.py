#!/usr/bin/env python

'''
Script to generate the tracker file for a customer

Instructions: 
    Generate minified version of the tracker script
    upload to the CDN location
    modify the templated bootloader script to reflect the new destination 

Example command to generate a minified tracker
# ./generate_tracker.py --trackerid 1234 --minify 1

Example command to generate a minified tracker and upload to test location
# ./generate_tracker.py --trackerid 1234 --minify 1 --upload_location s3test

'''
import boto.s3.connection
from boto.s3.key import Key
from boto.exception import S3ResponseError
from optparse import OptionParser
import re
import sys
from StringIO import StringIO
import urllib
import urllib2

# constants
CLOSURE_URL = "http://closure-compiler.appspot.com/compile"
BOOTLOADER_FNAME = "neonoptimizer_%s.js"
MAINJS_FNAME = "neon_main_%s.js"

# s3 locations
s3locations = {
    "s3test" : "neon-test",
    "s3prod" : "neon-cdn-assets"
}

def compile_js(contents):
    data = { "compilation_level" : "SIMPLE_OPTIMIZATIONS",
                "output_format" : "text",
                "output_info" : "compiled_code",
                "js_code" : contents
            }

    body = urllib.urlencode(data)
    req = urllib2.Request(CLOSURE_URL, body)
    try:
        response = urllib2.urlopen(req)
        output = response.read()
        return output
    except Exception, e:
        print e

def upload_to_s3(location, bootloader, contents, tai):
    
    def s3_uploader(basename, data):
        try:
            bucket_name = s3locations[location]
        except KeyError:
            print "invalid location to upload"
            return
            
        # only supports if you have boto credentials locally ~/.boto
        conn = boto.s3.connection.S3Connection()
        bucket = conn.get_bucket(bucket_name)
        k = Key(bucket)
        k.name = basename
        k.content_type = "application/javascript"
        policy = 'public-read'
        s3data = StringIO()
        s3data.write(data)
        s3data.seek(0)

        try:
            k.set_contents_from_file(s3data, policy=policy)
        except Exception, e:
            #TODO: More specific exceptions
            print "Error writing the file", e
            return

        return "http://%s.s3.amazonaws.com/%s" % (bucket_name, basename)

    # upload main js to the given location
    mainjs = MAINJS_FNAME % tai
    mainjs_s3url = s3_uploader(mainjs, contents)

    import pdb; pdb.set_trace()

    # change the location in the bootloader template
    with open(bootloader, 'r') as f:
        bootloader_contents = f.read().strip()
        # replace MAIN_JS_URL with actual URL
        new_boot = bootloader_contents.replace("MAIN_JS_URL", mainjs_s3url)

        # upload bootloader
        bootjs = BOOTLOADER_FNAME % tai
        bootjs_url = s3_uploader(bootjs, new_boot)
        print "The optimizer script has been uploded to %s" % bootjs_url

def main(options):
    # Insert Tracker Id
    tai = options.trackerid

    # Tracker filename format
    fname = "neon_main_%s.js" % tai 

    contents = ''
    with open(fname, 'w') as f:
        # Insert Tracker type
        contents = "var neonPublisherId = '%s';\n" % tai

        contents += "var neonTrackerType = '%s';" % options.trackertype

        # Insert basic modules
        with open(options.basic_module, 'r') as bm:
            basic_module = bm.read()
            contents += basic_module
        
        # Insert specific customer modules
        if options.custom_module:
            with open(options.custom_module, 'r') as cm:
                custom_module = cm.read()
                contents += custom_module

        # Insert Player module
        if options.player_module:
            with open(options.player_module, 'r') as pm:
                player_module = pm.read()
                contents += player_module

        # Insert Player module
        with open(options.main_module, 'r') as mm:
            main_module = mm.read()
            contents += main_module
    
        # Compile the file 
        if options.minify != 0:
            output = compile_js(contents)
            if not output:
                print "Compile error, check for syntax errors in the modules"
                sys.exit(1)
            else:
                contents = output
            
        f.write(contents)

        # upload the optimizer script to S3
        if options.upload_location is not None:
            upload_to_s3(options.upload_location, options.bootloader, contents, tai)

if __name__ == '__main__':

    parser = OptionParser()
    
    parser.add_option('--minify', default=0, type=int)
    parser.add_option('--trackerid', default=None, type=str)
    parser.add_option('--trackertype', default="gen", type=str)
    parser.add_option('--bootloader', default="js/bootloader.js.template", type=str)
    parser.add_option('--basic_module', default="js/basic_modules.js.template", 
                        type=str)
    # currently supports only a single module
    parser.add_option('--custom_module', default=None, type=str, 
                    help="path to custom module")
    parser.add_option('--player_module', default=None, type=str, 
                       help="path to player module")
    parser.add_option('--main_module', default="js/main_module.js.template",
                        type=str)
    # options - s3test / s3prod (neon cdn)
    parser.add_option('--upload_location', default=None, type=str)
    options, args = parser.parse_args()

    if options.trackerid is None:
        print "TrackerId has not be specified"
        sys.exit(0)
    main(options)
