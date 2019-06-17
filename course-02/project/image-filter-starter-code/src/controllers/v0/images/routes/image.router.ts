const fs = require('fs');
const path = require('path');
import { Router, Request, Response } from 'express';
import { filterImageFromURL, spawnPythonProcess } from '../../../../util/util';
import { SlowBuffer } from 'buffer';


const router: Router = Router();

const extensions: { [key:string]:string; } = {
    '.jpg': 'image/jpg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
}

const mainDir = () => require('path').dirname(require.main.filename);

const workingDir = (name:string) => {
    const directory = [mainDir(), name].join('/')
    if (!fs.existsSync(directory)){
        fs.mkdirSync(directory);
    }
    return directory;
}

router.get('/', async (req: Request, res: Response) => {
    const imageUrl = req.query.image_url;
    
    const dirIn = workingDir('downloads_greyscale')
    const dirOut = workingDir('downloads_edgedetection')
    const downloadedImagePath = await filterImageFromURL(imageUrl, dirIn);
    const fileName = path.basename(downloadedImagePath);

    spawnPythonProcess(
        fileName,
        dirIn,
        dirOut,
        () => {
            const img = fs.readFileSync([dirOut, fileName].join('/'));
            res.writeHead(200, {'Content-Type': extensions[path.extname(fileName)] });
            res.end(img, 'binary');
        },
        () => {
            res.status(500).send({ message: 'This is an error!' });
        });
    });

export const ImageRouter: Router = router;