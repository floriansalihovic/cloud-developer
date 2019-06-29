import cv2
import base64
import numpy as np


def transform(arg0):
    img = base64.b64decode(arg0)
    source_buffer = np.fromstring(img, dtype=np.uint8)
    image = cv2.imdecode(source_buffer, 1)
    # Convert to grayscale
    gray_scale_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    # Edge detectopm
    filtered = cv2.Canny(gray_scale_image, 50, 50)
    # Encode image
    retval, target_buffer = cv2.imencode('.jpg', filtered)
    # Create base64 representation
    return base64.b64encode(target_buffer)


def handler(event, context):
    print("body: " + event["body"])
    if not event["body"]:
        return {
            "isBase64Encoded": True,
            "statusCode": 500,
            "headers": {"content-type": "text/plain"},
            "body": "{\"error: \": \"Could not empty input data.\"}"
        }

    transformed = transform(event["body"])
    base64_string = transformed.decode('UTF-8')

    if not transformed:
        return {
            "isBase64Encoded": True,
            "statusCode": 500,
            "headers": {"content-type": "text/plain"},
            "body": "{\"error: \": \"Could not process input data.\"}"
        }
    else:
        return {
            "isBase64Encoded": True,
            "statusCode": 200,
            "headers": {"content-type": "text/plain"},
            "body": base64_string
        }

