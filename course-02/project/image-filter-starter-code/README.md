# Udagram Image Filtering Microservice

## Tasks

### Setup Node Enviornment

You'll need to create a new node server. Open a new terminal within the project directory and run:

1. Initialize a new project: `npm i`
2. run the development server with `npm run dev`

### Create a new endpoint in the server.ts file

The starter code has a task for you to complete an endpoint in `./src/server.ts` which uses query parameter to download an image from a public URL, filter the image, and return the result.

### Deploying your system

Follow the process described in the course to `eb init` a new application and `eb create` a new environment to deploy your image-filter service! Don't forget you can use `eb deploy` to push changes.

## Stand Out (Optional)

### Refactor the course RESTapi

If you're feeling up to it, refactor the course RESTapi to make a request to your newly provisioned image server.

## Deployments

The application is currently deployed at
- [http://udagram-imageserver-flosal-dev-dev](http://udagram-imageserver-flosal-dev-dev.eu-central-1.elasticbeanstalk.com).

The applications architecture involves a Nodejs server and a Python based Lambda, which depends on a Lambda Layer
providing the OpenCV lib. The two components exchange base64 encoded data, avoiding persisting files to disk. 