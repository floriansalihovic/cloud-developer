import {join} from 'bluebird';
import jimp = require('jimp');

export async function externalImageAsBase64(inputUrl: string): Promise<string> {
    if (inputUrl){
        try {
            const photo = await jimp.read(inputUrl);
            const base64String = await photo.getBase64Async(jimp.MIME_JPEG);
            return base64String.substr('data:image/jpg;base64,'.length + 1);
        } catch (e) {
            return null;
        }
    }
    return null;
}
