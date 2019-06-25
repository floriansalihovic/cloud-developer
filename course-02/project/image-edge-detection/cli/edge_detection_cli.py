#!/usr/bin/python

import base64
import json
import sys

from opencv_lambda import handler

with open(sys.argv[1], "rb") as image_file:
    encoded_string = base64.b64encode(image_file.read())

    with open(sys.argv[1] + '.base64.txt', 'a') as out:
        out.write(encoded_string.decode("utf-8"))
        event = {"body": encoded_string.decode("utf-8")}
        ret = handler(event, None)

        with open(sys.argv[1] + ".detectededges.jpg", "wb") as detected_edges:
            detected_edges.write(base64.b64decode(ret["body"]))

        with open(sys.argv[1] + ".detectededges.json", "wb") as json_file:
            json = json.dumps(ret)
            json_file.write(json.encode("utf-8"))
