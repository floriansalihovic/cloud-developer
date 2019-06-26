import {Request, Response, Router} from 'express';
import {externalImageAsBase64} from '../../../../util/util';
import jimp = require('jimp');

const AWS = require('aws-sdk');


const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {

    if (!!process.env.AWS_ACCESS_KEY_ID || !!process.env.AWS_SECRET_ACCESS_KEY) {
        res.writeHead(403, "Error");
        res.end();
        res.send('<html>' +
            '<body>' +
            '<h2>Unauthorized</h2>' +
            '<h3>Possible root cause</h3>' +
            '<p>The application appears to be running locally. AWS_SECRET_ACCESS_KEY and ' +
            'AWS_SECRET_ACCESS_KEY might not be set or a not authorizing against the AWS Lambda instance running ' +
            'the image detection. Using the the instance running at EBS will authenticate correctly.</p>' +
            '</body>' +
            '</html>');
        return;
    } else {
        const imageUrl = req.query.image_url;

        if (!Boolean(imageUrl) || imageUrl.length == 0) {
            res.status(204).send("/filteredImage: query parameter \"image_url\" must not be empty");
            return;
        }

        const base64 = await externalImageAsBase64(imageUrl);
        const lambda = new AWS.Lambda();
        const params = {
            FunctionName: 'handler', /* required */
            Payload: JSON.stringify({
                body: base64
            })
        };

        lambda.invoke(params, async function (err: any, data: any) {
            if (err) {
                res.writeHead(403, "Error");
                res.end('<html>' +
                    '<body>' +
                    '<h3>Internal Server Error</h3>' +
                    '<p>' + err + '</p>' +
                    '<h2>Possible root cause</h2>' +
                    '<p>The application appears to be running locally. AWS_SECRET_ACCESS_KEY and ' +
                    'AWS_SECRET_ACCESS_KEY might not be set or a not authorizing against the AWS Lambda instance running ' +
                    'the image detection. Using the the instance running at EBS will authenticate correctly.</p>' +
                    '</body>' +
                    '</html>');
            } else {
                let err, image, binary;
                [err, image] = await to(jimp.read(Buffer.from(JSON.parse(data['Payload']).body, 'base64')));
                if (err) {
                    res.status(500).send("Internal server error");
                    return;
                } else {
                    [err, binary] = await to(image.getBufferAsync(jimp.MIME_JPEG));
                    if (err) {
                        res.status(500).send("Internal server error");
                    } else {
                        res.writeHead(200, {'Content-Type': 'image/jpg'});
                        res.end(binary, 'binary')
                    }
                }
            }
        });
    }
});

// https://blog.grossman.io/how-to-write-async-await-without-try-catch-blocks-in-javascript/
function to(promise: any) {
    return promise.then((data: any) => {
        return [null, data];
    }).catch((err: any) => {
        return [err, null];
    });
}

export const ImageRouter: Router = router;