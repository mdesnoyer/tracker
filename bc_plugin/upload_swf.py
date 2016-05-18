#!/usr/bin/env python

'''Upload plugin tracker to its test or prod s3 location'''

from argparse import ArgumentParser
from os import sys
sys.path.insert(0, '..')
from generate_tracker import s3_uploader

local_source_path = 'dist/brightcove-smart-tracker.swf'
s3_target_path = 'plugins/brightcove-smart-tracker.swf'

if __name__ == '__main__':
    parser = ArgumentParser('Upload tracker swf to s3')
    parser.add_argument(
        '-t',
        '--target',
        required=True,
        type=str,
        choices=['s3test', 's3prod'])
    args = parser.parse_args()

    with open(local_source_path, 'r') as file_handle:
        url = s3_uploader(
            args.target,
            s3_target_path,
            file_handle.read())
        print('Uploaded to %s' % url)
