import fs from 'fs';
import Jimp = require('jimp');
import { spawn } from 'child_process';
import { join } from 'bluebird';

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string, targetDir: string): Promise<string>{
    return new Promise( async resolve => {
        let photo = await Jimp.read(inputURL);
        const outpath = [targetDir, 'filtered.'+Math.floor(Math.random() * 2000)+'.jpg'].join('/');
        await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(outpath, (img)=>{
            resolve(outpath);
        });
    });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files:Array<string>){
    for( let file of files) {
        fs.unlinkSync(file);
    }
}

/**
 * Calls a python script
 */
export async function spawnPythonProcess(path:string, sourceDir: string, targetDir:string, callback: Function, err: Function) {
    const python = spawn('python3', ['src/image_filter.py', path, sourceDir, targetDir])

    if (python !== undefined) {
        python.stdout.on('data', (data) => { callback(); });
        python.stderr.on('data', function (data) { err(); });
    } else {
        console.log(`could not spawn process`);
    }
}