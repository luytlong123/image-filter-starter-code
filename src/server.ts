import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
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
  app.get( "/filteredimage", async ( req: Request , res: Response ) => 
  {    
    const { image_url } :{image_url:string} = req.query;
    if ( !isImgUrl(image_url)) {
      return res.status(400).send("Please enter a valid url " + image_url);
    }
   
    await filterImageFromURL(image_url)
    .then(function (filtered_image){
      res.status(200).sendFile(filtered_image, () => {       
                   deleteLocalFiles([filtered_image]);       
                });   
            }
          ).catch(function(error: Error){
            res.status(400).send(error);
              });  
              
  }); 

  // check image url
  function isImgUrl(url : any) {
    if(typeof url !== 'string' || !url || url === "") return false;
    return(url.match(/^http[^\?]*.(jpg|jpeg|png|bmp)(\?(.*))?$/gmi) != null);
  }

  //! END @TODO1
  
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req: Request , res: Response) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
