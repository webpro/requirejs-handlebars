# requirejs-handlebars

Simple Handlebars plugin for RequireJS.

* Requires the official `text!` plugin.
* Like the offical `text!` plugin, include the file extension in the module id.
* For (optimized) builds using r.js, make sure to
	* **Install Handlebars from npm** (not Bower or [website](http://handlebarsjs.com)).
	* Include the **runtime** version of Handlebars.
* Supports preprocessing of templates before they are precompiled.

## Example usage

    define(['hb!myTemplate.tpl'], function(myTemplate) {

        var html = myTemplate({name:'John Doe'});

    });

## Partials

This plugin has no automatic partial registration (by design).

    define(['hb!myTemplate.tpl', 'hb!myPartial.tpl'], function(myTemplate, myPartial) {

        var html = myTemplate({name:'John Doe'}, {
            partials: {
                myPartial: myPartial
            }
        });

    });

## Example config

Handlebars includes AMD builds since v1.1.0. Use a `package` config:

	require.config({
		paths: {
			text: 'lib/text/text',
			hb: 'lib/requirejs-handlebars/hb',
			'handlebars.runtime': 'node_modules/handlebars/handlebars.runtime.amd'
		},
		packages: [
			{
				name: 'handlebars',
				location: 'node_modules/handlebars/dist/amd',
				main: './handlebars'
			}
		]
	});

Using a version of Handlebars lower than v1.1.0? Then use a configuration like this:

    require.config({
        paths: {
            text: 'lib/requirejs-text/text',
            handlebars: 'node_modules/handlebars/dist/handlebars',
            hb: 'lib/requirejs-handlebars/hb'
        },
        shim: {
            handlebars: {
                exports: 'Handlebars'
            }
        }
    });

## Handlebars runtime

The Handlebars runtime is much smaller than the full version, and it's made to render pre-compiled templates.
It's highly efficient to use pre-compiled templates and the runtime template engine in production.

Pre-compiled templates use `handlebars.runtime` as a dependency.

Still using a version of Handlebars lower than v1.1.0? Then override the path for `handlebars`, e.g.:

        paths: {
            handlebars: 'node_modules/handlebars/dist/handlebars.runtime'
        }

## Preprocessing

The plugin allows to process the data before it gets precompiled by utilizing the `preProcess` configuration option:

	require.config({
		config: {
			hb: {
				preProcess: function(done, options, data) {
					done(modifiedData);
				}
			}
		}
	});

It's like a two-phase pre-compilation that includes your custom rendering, and then let Handlebars precompile the resulting template. This is very useful for including e.g. translated data (i18n) in your precompiled templates.

The benefit lies in the performance win: no template helper needed at runtime in the optimized build, since the processed (translated) text is already there. This way, the overhead of including the dictionary file and the template helper calls is removed.

See [requirejs-handlebars-i18n-example](https://github.com/webpro/requirejs-handlebars-i18n-example) for an example.

## License

[MIT](http://webpro.mit-license.org)
