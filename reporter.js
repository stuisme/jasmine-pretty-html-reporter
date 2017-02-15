const fs = require('fs');
const path = require('path');

class Reporter {

  constructor(options) {
    this.options = options;
    this._sequence = [];
    this._counts = {};

    if (!fs.existsSync(this.options.path)){
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

    fs.writeFileSync(path.join(this.options.path, 'results.json'), JSON.stringify(logEntry, null, 4), 'utf8');
    fs.createReadStream(path.join(__dirname, 'report.html')).pipe(fs.createWriteStream(path.join(this.options.path, 'report.html')));
  };
}

module.exports = Reporter;