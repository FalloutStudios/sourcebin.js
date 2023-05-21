# Sourcebin.js

A simple https://sourceb.in api library

## Installation

```bash
npm i sourcebin.js
yarn add sourcebin.js
pnpm add sourcebin.js
```

### Simple Usage

```js
const { create, get, LanguageType } = require('sourcebin.js'); // Use import for ES Modules

create({
    title: 'My Bin',
    files: [
        {
            name: 'hello.js',
            content: 'console.log("hello, world!");',
            languageId: LanguageType.Javascript
        }
    ]
})
.then(async ({ key }) => {
    const data = await get(key); // Gets the bin data
})
```

### Usage With Account

To get your token, login to https://sourceb.in then open the dev panel in your brower then find the applications tab then go to `cookies` then copy the value of `access_token`.

![](https://i.imgur.com/zsZjHD4.png)

```js
const { Client, LanguageType } = require('sourcebin.js'); // Use import for ES Modules

const client = new Client({
    token: 'acess_token'
});

client.createBin({
    title: 'My Bin',
    files: [
        {
            name: 'hello.js',
            content: 'console.log("hello, world!");',
            languageId: LanguageType.Javascript
        }
    ]
}).then(async bin => {
    await bin.delete(); // Deletes the created bin
});
```