import sys
import cv2
import os

def process(file_name, source_dir, target_dir):
    if not os.path.exists(target_dir):
        os.makedirs(target_dir)

    # Load the image from disk
    source_file = "/".join([source_dir, file_name])
    img = cv2.imread(source_file ,0)
    if img is None:
        return False, "Image Failed to Load (" + source_file + ")"

    # Apply the Canny edge detection filter
    filtered = cv2.Canny(img, 50, 50)
    if filtered is None:
        return False, "Image Failed To Filter (" + source_file + ")"


    # Write the image back to disk
    target_file = "/".join([target_dir, file_name])
    out = cv2.imwrite(target_file, filtered)
    if out == False:
        return False, "Image Failed To Write (" + target_file + ")"

    return True, target_file


isSuccess, message = process(sys.argv[1], sys.argv[2], sys.argv[3])
print(isSuccess)
print(message)
sys.stdout.flush()