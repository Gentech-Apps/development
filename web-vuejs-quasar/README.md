
  
# <img src="https://upload.wikimedia.org/wikipedia/commons/9/95/Vue.js_Logo_2.svg" width="20" height="20" alt="Vue.js"/> Vue3 + <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" width="20" height="20" alt="Quasar"/> Quasar App (demo)
Code to demonstrate the vue3 + quasar app folder structure, workflow and the best practices 

## Project Structure

```
├──public/
├──src/
├──── assets/           # Static assets
├──── boot/             # Boot files
├──── components/       # Reusable components
├──── constants/        # Reusable constants
├──── css/       # Reusable CSS
├──── layouts/          # Layouts
├──── pages/            # Pages
├──── router/           # Router configuration
├──── store/            # Vuex store
├──── utils/            # Utility functions
├──── services/         # Services
├── App.vue           # Main application component
├── main.js           # Main application entry point
├── quasar.conf.js    # Quasar configuration
└── README.md         # Project documentation
```

## Prerequisites

Make sure you have [Yarn](https://yarnpkg.com/) installed. If not, you can install it by following the instructions on the [Yarn installation page](https://yarnpkg.com/getting-started/install).

## Install the dependencies

```bash
yarn
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
yarn lint
```

### Format the files

```bash
yarn format
```

### Build the app for production

```bash
quasar build
```

### Customize the configuration

See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js) for details on customizing the Quasar framework configuration, including build options, plugins, and more.
