# neontrackerstratchpad

Temp repo for Neon tracker v2

## Release process 

```sh minifier.sh js/neon.js js/neon-main.js```

```sh minifier.sh js/neonbootloader.js js/neonbctracker.js```

## includes

This will compare the ID of the customer we are generating the Javascript for with the id parameter passed in the include. The goal here is to have one master file and drive the customer specific code through the use of conditional includes.

To include a file from the `_partials` directory at compile time, use code of the format below:

```
{% include any-filename-you-like.extension id="[customer id]" %}
```

For example:

```
{% include 2089095449.test.js id="2089095449" %}
```

- The file should exist in the `_partials` directory
- If there is no match on id then the include call is removed
- If there is a match on id then we try to include the contents of the file
- If we cannot find the file then we log an error and remove the include in the compiled JS

## Testing

There are two test you can include in the template `basic_modules.js.template` that can be used for testing. Add in:

```
{% include 123456789.test.js id="123456789" %}
{% include 987654321.test.js id="123456789" %}
```

If you run

```
./generate_tracker.py --trackerid 123456789
```

- You should see an error in the console AND in the generated file `neon_main_123456789.js`.
- You should also see the contents of `123456789.test.js` included into `neon_main_123456789.js`
