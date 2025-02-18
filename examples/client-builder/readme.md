# Client Builder example

In this example, you will learn on how to

- export service definitions into JSON files
- generate TypeScript client code from JSON files
- generate TypeScript client code from backend code base

## Export service definitions into JSON files

To run the example for exporting the service definitions into JSON files, run the following command:

```bash
npm run export
```

The implementation can be found in the file [src/export.ts](src/export.ts).
There are only a few lines to export the definitions.

Be aware, that in the example, only a single JSON file is created. In a real-world scenario, you might want to export multiple service definitions into separate JSON files.

## Generate TypeScript client code from JSON files

To run the example for generating the TypeScript client code from JSON files, run the following command:

```bash
npm run client:file
```

It only takes a few lines of code to generate the TypeScript client code from JSON files. You can find the implementation in the file [src/generateClientFromFile.ts](src/generateClientFromFile.ts).

## Generate TypeScript client code from backend code base

Similar to the JSON example, it is possible to combine the steps, without the need to export the service definitions into JSON files. Instead, you can directly generate the TypeScript client code from your backend code base.

```bash
npm run client:code
```

The implementation can be found in the file [src/generateClientFromCode.ts](src/generateClientFromCode.ts).

---

- Official Website: **[purista.dev](https://purista.dev)**
- Follow on Twitter **[@purista_js](https://twitter.com/purista_js)**
- Join the **[Discord Chat](https://discord.gg/9feaUm3H2v)**

<a href="https://www.producthunt.com/posts/purista?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-purista" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=386519&theme=light" alt="PURISTA - Typescript&#0032;framework&#0032;for&#0032;IoT&#0044;&#0032;microservices&#0044;&#0032;and&#0032;serverless | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

---
