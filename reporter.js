'use strict';

const fs = require('fs');
const path = require('path');

//path setup
const templatePath = path.join(__dirname, 'report.html');
const fileContents = fs.readFileSync(templatePath).toString();


class Reporter {

    constructor(options) {
        this.options = options;
        this._sequence = [];
        this._counts = {};
        this._timer = {};

        if (!fs.existsSync(this.options.path)) {
            fs.mkdirSync(this.options.path);
        }

        this.destination = path.join(this.options.path, 'report.html');
    }

    nowString() {
        return (new Date()).toISOString();
    }

    jasmineStarted(suiteInfo) {
        this._timer.jasmineStart = this.nowString();
    };

    suiteStarted(result) {
    };

    specStarted(result) {
        this._start = this.nowString();
    };

    specDone(result) {
        result.stoped = this.nowString();
        result.started = this._start;
        this._sequence.push(result);
        this._counts[result.status] = (this._counts[result.status] || 0) + 1;
        this.writeFile();
    };

    suiteDone(result) {
    };

    jasmineDone() {
      this._timer.jasmineDone = this.nowString();
      this.writeFile();
    };

    writeFile(){
      let logEntry = {
        timer: this._timer,
        sequence: this._sequence,
        counts: this._counts
      };

      let results = fileContents.replace('\'<Results Replacement>\'', JSON.stringify(logEntry, null, 4));
      fs.writeFileSync(this.destination, results, 'utf8');
    }
}

module.exports = Reporter;