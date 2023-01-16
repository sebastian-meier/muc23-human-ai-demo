This repo is part of the LoCobSS research project. More details about the project and dependencies to other repos can be found [here](https://github.com/sebastian-meier/LoCobSS-documentation).

# LoCobSS-platform
Svelte Application bringing together all of LoCobSS's services

## Development
The system is build using [SVELTE](https://www.svelte.dev).
```bash
npm install
npm run dev
```

## Deploy
Create a firebase.json, based on sample-firebase.json, as well as a .firebaserc (see Google Cloud / Firebase docs).
Create a .env file, based on .sample-env.

```bash
npm run build
firebase deploy --only hosting
```
