define(['text', 'handlebars', 'module'], function(text, handlebarsImport, module) {

	var pluginConfig = module.config(),
		importDefault = handlebarsImport.hasOwnProperty('default'),
		handlebars = importDefault ? handlebarsImport['default'] : handlebarsImport,
		buildCache = {},
        buildCompileTemplate = importDefault ?
			'define("{{pluginName}}!{{moduleName}}", ["handlebars.runtime"], function(hr) {return hr["default"].template({{{fn}}})});' :
			'define("{{pluginName}}!{{moduleName}}", ["handlebars"], function(handlebars) {return handlebars.template({{{fn}}})});',
        buildTemplate;

	var finishLoad = function(moduleName, load, config, data) {
		if(config.isBuild) {
			buildCache[moduleName] = data;
			load();
		} else {
			load(handlebars.compile(data));
		}
	};

    var load = function(moduleName, parentRequire, load, config) {

		var done = finishLoad.bind(null, moduleName, load, config),
			doPreProcess = pluginConfig && typeof pluginConfig.preProcess === 'function',
			preProcess;

		if(doPreProcess) {
			preProcess = pluginConfig.preProcess.bind(null, done, {
				moduleName: moduleName,
				parentRequire: parentRequire,
				config: config,
				pluginConfig: pluginConfig
			});
		}

        text.load(moduleName, parentRequire, doPreProcess ? preProcess : done, config);

    };

    var write = function(pluginName, moduleName, write) {

        if(!handlebars.precompile && require.nodeRequire) {
            try {
                handlebars = require.nodeRequire('handlebars');
            } catch(error) {
                process.stdout.write("\nLooks like the runtime version of Handlebars is used.\n");
                process.stderr.write("Install handlebars with npm to precompile templates: npm install handlebars --save-dev\n\n");
            }
        }

        if(moduleName in buildCache) {

            if(!buildTemplate) {
                buildTemplate = handlebars.compile(buildCompileTemplate);
            }

            write(buildTemplate({
                pluginName: pluginName,
                moduleName: moduleName,
                fn: handlebars.precompile(buildCache[moduleName])
            }));
        }
    };

    return {
        load: load,
        write: write
    };
});
