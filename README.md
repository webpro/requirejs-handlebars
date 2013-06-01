# requirejs-handlebars

Simple Handlebars plugin for RequireJS.

* Requires the official `text!` plugin.
* Like the offical `text!` plugin, include the file extension in the module id.
* Make sure to include `handlebars.runtime.js` from Handlebars in your build instead of `handlebars.js`.

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

    require.config({
        paths: {
            'text': 'lib/requirejs-text/text',
            'handlebars': 'lib/handlebars/handlebars',
            'hb': 'lib/requirejs-handlebars/hb'
        },
        shim: {
            'handlebars': {
                exports: 'Handlebars'
            }
        }
    });
