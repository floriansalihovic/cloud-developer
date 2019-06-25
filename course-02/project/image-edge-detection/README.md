# Edge detection

The goal of this project is to deploy a lambda function implemented in Python providing edge detection. The
implementation will be straight forward utilizing [OpenCV](https://pypi.org/project/opencv-python/). The implementation
is based on [OpenCV on AWS Lambda](https://github.com/iandow/opencv_aws_lambda) and the image processing file provided 
by [Udacity (image_filter.py@github.com)](https://github.com/grutt/udacity-c2-image-filter/blob/dev/src/image_filter.py).

The lambda function will be used to complete project 2 of the Cloud Developer Nanodegree. 

## Tasks (newly found challenges)

- creating a lambda handler which is executable as fast as possible
- creating a lambda layer which contains the OpenCV library and other required dependencies
- creating a `Makefile` for automated builds and deployments

## Automating everything

As the project requires the integration of services, IAM roles need to be set up. The management console provides an 
interface to create them, but he environment could not be reproduced easily. The AWS command line application provides 
programmatic way to create IAM roles and policies. This documented in the Makefile in the targets `aws_create_roles`.

The lambda handler needs to be packages, uploaded and deployed. Please see the targets `aws_lambda_package`, 
`aws_lambda_upload` and `aws_lambda_publish`. 

The lambda layer uses Docker additional external dependency to create the layer based on packaged dependencies of an 
`amazonlinux` based container. The package is copied into the hosts file system and uploaded to S3, making it available 
for binding the lambda to it. The corresponding 
targets are
- `aws_docker_build`
- `aws_docker_run`
- `aws_lambda_layer_upload`
- `aws_lambda_layer_publish`
- `aws_lambda_layer_attach`

## Challenges and victories

### Python's dynamic typing

As debugging a lambda function is not as simple as debugging a local file, `cli/edge_detection_cli.py` was created to 
inspect the source code. Input of the command line app and the arguments passed to the lambda did not match and string 
vs bytes had to be understood and passed down to the handler correctly.

### Makefile

Invoking shell commands and creating (environment) variables for the `Makefile` was as simple and troublesome as typos 
the state of a shell is very dynamic. To gain control over the details, `configure.sh` is writing `<aws_profile_name>_env.sh` 
which can be sourced, providing general account information to the `Makefile`. Adding the pattern `*_env.sh` avoids 
committing it to git accidentally. This does not appear to be a good solution, but helped getting things started.

### Conclusion

The process is automated quite well, but the [aws-cli](https://aws.amazon.com/cli/) needs to be understood in more 
detail to use it effectively.

## Sources

http://www.bigendiandata.com/2019-04-15-OpenCV_AWS_Lambda/
https://github.com/iandow/opencv_aws_lambda