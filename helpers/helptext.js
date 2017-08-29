module.exports = function(){
    let description = [];

    if(this._description){
        description.push(`\n  ${this._description}`);
    }

    description.push(`\n  Usage:\n\n    ${ this._name } ${ this.usage() }`);

    const commandHelp = this.commandHelp();

    if (commandHelp){
        description.push(`${commandHelp}`);
    }

    description.push(`  Flags:\n\n${this.optionHelp().replace(/^/gm, '    ')}\n\n`);

    return description.join('\n');
}