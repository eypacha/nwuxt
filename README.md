# Nwuxt

## Boilerplate for New Nuxt Website
This project is a boilerplate for quickly developing web applications using Nuxt. It includes several useful modules and dependencies to get you started.

## Features

- [Nuxt 3](https://nuxt.com/docs/getting-started/introduction) - Framework for Vue.js applications.
- [Pinia](https://pinia.vuejs.org/) - State management library.
- [Sass](https://sass-lang.com/documentation) - CSS preprocessor.
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS framework.
- [Nuxt Color Mode](https://color-mode.nuxtjs.org/) - Dark and Light mode with auto detection.
- [Shadcn Vue](https://www.shadcn-vue.com/) - Collection of re-usable UI components
- [Nuxt Fonts](https://github.com/nuxt-modules/font) - Easy font management.
- [Nuxt Icon](https://github.com/nuxt-modules/icon) - 200,000+ ready to use icons  

## Setup

Make sure to install dependencies:

```bash
# yarn
yarn install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
yarn dev
```

Add a new Shadcn Vue component:

```bash
yarn shadd <component>
```

Cleans up the project by removing generated files and reinstalling dependencies:

```bash
yarn reinstall
```

## Production

Build the application for production:

```bash
yarn build
```

Generate static files:

```bash
yarn generate
```

Locally preview production build:

```bash
yarn preview
```