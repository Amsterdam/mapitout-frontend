# mapitout-frontend

Map application to visualize travel times to and from various points on the map.

## Project setup
The google maps public key used in production is most likely restricted, in order to get the maps working, add an `.env.local` file to the root of the project with the following contents:

```
VUE_APP_GOOGLE_API_KEY=your-google-maps-key-here
```
Use the `.env.local` file to override any api endpoint. The keys for the API endpoints can be found in the `.env` file.

Then run:
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Run your unit tests
```
yarn run test:unit
```

### Run your unit tests with coverage
```
yarn run test:unit --coverage
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
