#! /usr/bin/env node
const program = require('commander');
const pjson = require('./package.json');
const helptext = require('./helptext.js');
const configuration = require('./configuration.js');

program.helpInformation = helptext; // Overrides help text

program.version(pjson.version)
    .description('Shopify Theme is a tool for manipulating Shopify themes.');

program.command('configure')
    .description('Creates configuration file')
    .action(configuration);

program.command('version')
    .description('Returns version')
    .action(() => console.log(pjson.version));

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}