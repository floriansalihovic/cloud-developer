import {Request, Response, Router} from 'express';
import {URL} from "url";
import jimp = require('jimp');

const AWS = require('aws-sdk');


const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
    console.log(process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY);
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
        res.writeHead(403, ('<html>' +
            '<body>' +
            '<h2>Unauthorized</h2>' +
            '<h3>Possible root cause</h3>' +
            '<p>The application appears to be running locally. AWS_SECRET_ACCESS_KEY and ' +
            'AWS_SECRET_ACCESS_KEY might not be set or a not authorizing against the AWS Lambda instance running ' +
            'the image detection. Using the the instance running at <a href="http://udagram-imageserver-flosal-dev-dev.eu-central-1.elasticbeanstalk.com">' +
            'Elastic Beanstalk</a> will authenticate correctly and with a valid reference to a <code>jpg</code> or ' +
            '<code>jpeg</code> an image rendering detected edges will be rendered.</p>' +
            '</body>' +
            '</html>'));
        res.end();
    } else {
        const imageUrl = req.query.image_url;

        if (!Boolean(imageUrl) || imageUrl.length == 0) {
            res.status(204).send("/filteredImage: query parameter \"image_url\" must not be empty");
            return;
        } else {
            try {
                const url = new URL(imageUrl);
                if (!(imageUrl.endsWith('.jpg') || imageUrl.endsWith('.jpeg'))) {
                    res.status(200).send('/filteredImage: only .jpg and .jpeg extensions are allowed');
                } else {
                    // @ts-ignore
                    jimp.read(imageUrl, (err: any, image: any) => {
                        if (err) {
                            throw err;
                        }
                        console.debug(`loaded image from ${imageUrl} successfully`);
                        image.getBase64(jimp.MIME_JPEG, (err: any, base64String: any) => {
                            if (err) {
                                throw err;
                            }
                            const payload = JSON.stringify({
                                body: base64String.substr('data:image/jpg;base64,'.length + 1)
                            });
                            console.debug(`invoking lambda with base64 string ${base64String.substr(0, 50)}...`);
                            new AWS.Lambda().invoke({
                                FunctionName: 'handler',
                                Payload: payload
                            }, (err: any, data: any) => {
                                if (err) {
                                    throw err;
                                }
                                // @ts-ignore
                                jimp.read(Buffer.from(JSON.parse(data['Payload']).body, 'base64'), (err: any, value: any) => {
                                    if (err) {
                                        throw err;
                                    }
                                    value.getBuffer(jimp.MIME_JPEG, (err: any, buffer: any) => {
                                        if (err) {
                                            throw err;
                                        }
                                        res.writeHead(200, {'Content-Type': 'image/jpg'});
                                        res.end(buffer, 'binary')
                                    });
                                });
                            });
                        });
                    });
                }
            } catch (err) {
                res.status(500).send(err);
            }
        }
    }
});

export const ImageRouter: Router = router;