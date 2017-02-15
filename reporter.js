'use strict';

const fs = require('fs');
const path = require('path');

class Reporter {

    constructor(options) {
        this.options = options;
        this._sequence = [];
        this._counts = {};

        if (!fs.existsSync(this.options.path)) {
            fs.mkdirSync(this.options.path);
        }

    }

    nowString() {
        return (new Date()).toISOString();
    }

    jasmineStarted(suiteInfo) {
        //this._sequence.push(suiteInfo);
    };

    suiteStarted(result) {
        //this._sequence.push(result);
    };

    specStarted(result) {
        this._start = this.nowString();
        //this._sequence.push(result);
    };

    specDone(result) {
        result.stoped = this.nowString();
        result.started = this._start;
        this._sequence.push(result);
        this._counts[result.status] = (this._counts[result.status] || 0) + 1;
    };

    suiteDone(result) {
        //this._sequence.push(result);
    };

    jasmineDone() {
        let logEntry = {
            sequence: this._sequence,
            counts: this._counts
        };

        let templatePath = path.join(__dirname, 'report.html');
        let destination = path.join(this.options.path, 'report.html');
        let fileContents = fs.readFileSync(templatePath).toString();

        fileContents = fileContents.replace('\'<Results Replacement>\'', JSON.stringify(logEntry, null, 4));

        fs.writeFileSync(destination, fileContents, 'utf8');
    };
}

module.exports = Reporter;