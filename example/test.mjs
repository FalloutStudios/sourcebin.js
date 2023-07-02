// @ts-check
import { Client } from '@falloutstudios/sourcebin.js';

const sourcebin = new Client();


const bin = await sourcebin.createBin({
    title: 'Test',
    files: [
        {
            name: 'test.txt',
            content: 'console.log(`Hellow, world!`)'
        }
    ]
});

console.log(bin);