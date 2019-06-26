import {Request, Response, Router} from 'express';
import {externalImageAsBase64} from '../../../../util/util';
import jimp = require('jimp');

const AWS = require('aws-sdk');


const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
    const imageUrl = req.query.image_url;

    if (!Boolean(imageUrl) || imageUrl.length == 0) {
        res.send("/filteredImage: query parameter \"image_url\" must not be empty");
    }

    const base64 = await externalImageAsBase64(imageUrl);
    const lambda = new AWS.Lambda();
    const params = {
        FunctionName: 'handler', /* required */
        Payload: JSON.stringify({
            body: base64
        })
    };

    lambda.invoke(params, function (err: any, data: any) {
        if (err) {
            res.writeHead(403, '<html>' +
                '<body>' +
                '<h3>Internal Server Error</h3>' +
                '<p>' + err + '</p>' +
                '<h2>Possible root cause</h2>' +
                '<p>The application appears to be running locally. AWS_SECRET_ACCESS_KEY and ' +
                'AWS_SECRET_ACCESS_KEY might not be set or a not authorizing against the AWS Lambda instance running ' +
                'the image detection. Using the the instance running at EBS will authenticate correctly.</p>' +
                '</body>' +
                '</html>');
            res.end();
        } else {
            const buffer = Buffer.from(JSON.parse(data['Payload']).body, 'base64');
            jimp.read(buffer)
                .then(img => {
                    img.getBuffer(jimp.MIME_JPEG, (err, buffer) => {
                        res.writeHead(200, {'Content-Type': 'image/jpg'});
                        res.end(buffer, 'binary');
                    });
                })
                .catch((err) => {
                    res.writeHead(500, err);
                    res.end()
                });
        }
    });

});

export const ImageRouter: Router = router;