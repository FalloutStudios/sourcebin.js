# Sourcebin.js

A simple https://sourceb.in api library

## Installation

```bash
npm i @falloutstudios/sourcebin.js
yarn add @falloutstudios/sourcebin.js
pnpm add @falloutstudios/sourcebin.js
```

### Simple Usage

```js
const { create, get, LanguageType } = require('@falloutstudios/sourcebin.js'); // Use import for ES Modules

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

To get your token, login to https://sourceb.in, open the dev panel in your browser, find the applications tab, go to cookies, then copy the value of `access_token`.

![](https://i.imgur.com/zsZjHD4.png)

```js
const { Client, LanguageType } = require('@falloutstudios/sourcebin.js'); // Use import for ES Modules

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