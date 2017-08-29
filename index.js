#! /usr/bin/env node
const program = require('commander');
const packageJson = require('./package.json');
const helptext = require('./helpers/helptext.js');
const configuration = require('./commands/configuration.js');
const download = require('./commands/download.js');
const watch = require('./commands/watch.js');
const upload = require('./commands/upload.js');
const open = require('./commands/open.js');

program.helpInformation = helptext; // Overrides help text

program.version(packageJson.version)
    .usage('[command]')
    .option('-e, --env [name]', 'Environment to run the command (default "development")')
    .description('Shopify Theme is a tool for manipulating Shopify themes.');

program.command('configure')
    .description('Creates configuration file')
    .action(() => configuration());

program.command('download')
    .description('Downloads theme files')
    .action(() => download(program.env));

program.command('open')
    .description('Open a preview for your store')
    .action(() => open(program.env));

program.command('upload')
    .description('upload theme file(s) to Shopify')
    .action(() => upload(program.env))

program.command('version')
    .description('Print the version number of Shopify Theme')
    .action(() => {
        console.log(packageJson.version)
        process.exit();
    });

program.command('watch')
    .description('Watch directory for changes and update remote theme')
    .action(() => watch(program.env));

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
    process.exit();
}