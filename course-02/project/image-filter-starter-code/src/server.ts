import express from 'express';
import bodyParser from 'body-parser';
import {IndexRouter} from './controllers/v0/index.router';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8081;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  const indexRoute = '/';
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("<html>" +
        "<body>" +
        "<h1>@TODO1 IMPLEMENT A RESTFUL ENDPOINT</h1>" +
        "<p>GET <a href='/filteredimage?image_url=https://timedotcom.files.wordpress.com/2019/03/kitten-report.jpg'>/filteredimage?image_url={{URL}}</a><br>" +
        "endpoint to filter an image from a public url.<br>" +
        "<h2>IT SHOULD</h2>" +
        "<ol>" +
        "<li>validate the image_url query</li>" +
        "<li>call filterImageFromURL(image_url) to filter the image - removed as the filtering is done in an AWS Lambda</li>" +
        "<li>send the resulting file in the response</li>" +
        "<li>deletes any files on the server on finish of the response</li>" +
        "</ol>" +
        "<h2>QUERY PARAMATERS</h2>" +
        "<ul>" +
        "<li>image_url: URL of a publicly accessible image</li>" +
        "</ul>" +
        "<h2>RETURNS</h2>" +
        "<ul>" +
        "<li>the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]</li>" +
        "</ul>" +
        "</body>" +
        "</html>" );
  } );
  
  app.use(indexRoute, IndexRouter)

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();