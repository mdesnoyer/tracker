#!/usr/bin/env python

'''
Script to generate the tracker file for a customer

Instructions: 
    Generate minified version of the tracker script
    upload to the CDN location
    modify the templated bootloader script to reflect the new destination 

Example command to generate a minified tracker
# ./generate_tracker.py --trackerid 1234 --minify 1

'''
from optparse import OptionParser
import sys
import urllib
import urllib2

CLOSURE_URL = "http://closure-compiler.appspot.com/compile"

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

def main(options):
    # Insert Tracker Id
    tai = options.trackerid

    # Tracker filename format
    fname = "neonoptimizer_%s.js" % tai 

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

if __name__ == '__main__':

    parser = OptionParser()
    
    parser.add_option('--minify', default=0, type=int)
    parser.add_option('--trackerid', default=None, type=str)
    parser.add_option('--trackertype', default="gen", type=str)
    parser.add_option('--basic_module', default="js/basic_modules.js.template", 
                        type=str)
    # currently supports only a single module
    parser.add_option('--custom_module', default=None, type=str, 
                    help="path to custom module")
    parser.add_option('--player_module', default=None, type=str, 
                       help="path to player module")
    parser.add_option('--main_module', default="js/main_module.js.template",
                        type=str) 
    options, args = parser.parse_args()

    if options.trackerid is None:
        print "TrackerId has not be specified"
        sys.exit(0)
    main(options)
