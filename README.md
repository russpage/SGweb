# Snelgrove Ice Cream

[![Netlify Status](https://api.netlify.com/api/v1/badges/4941fe1f-c086-422d-8cb3-a933ae6167a3/deploy-status)](https://app.netlify.com/projects/snelgrove/deploys)

Source for [snelgroveicecream.com](https://www.snelgroveicecream.com). Built with [Astro](https://astro.build) and Tailwind, deployed on Netlify from `main`.

## Develop

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```

The build fails if the flavor catalog drifts from the locked counts in `src/data/integrity.ts`.
