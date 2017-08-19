#! /usr/bin/env node
const program = require('commander');
const packageJson = require('./package.json');
const helptext = require('./helptext.js');
const configuration = require('./configuration.js');
const download = require('./download.js');
const watch = require('./watch.js');

program.helpInformation = helptext; // Overrides help text

program.version(packageJson.version)
    .usage('[command]')
    .description('Shopify Theme is a tool for manipulating Shopify themes.');

program.command('configure')
    .description('Creates configuration file')
    .action(() => configuration());

program.command('download')
    .description('Downloads theme files')
    .action(() => download());

program.command('version')
    .description('Print the version number of Shopify Theme')
    .action(() => console.log(packageJson.version));

program.command('watch')
    .description('Watch directory for changes and update remote theme')
    .action(() => watch());

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}