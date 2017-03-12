'use strict';

const fs = require('fs');
const path = require('path');

//path setup
const templatePath = path.join(__dirname, 'report.html');
const fileContents = fs.readFileSync(templatePath).toString();

/** A jasmine reporter that produces an html report **/
class Reporter {

    /**
     * @constructor
     * @param {Object} options - options for the reporter
     * @param {String} options.path - Path the report.html will be written to
     * @param {Boolean} options.writeReportEachSpec=true - Write the report between each spec, recommended for long running tests.
     * @param {Boolean} options.showSuspectLine=true - Show suspect line on overview
     * @param {Boolean} options.highlightSuspectLine=true - Highlight the suspect line in the detail dialog
     */
    constructor(options) {
        this.options = options;
        this.sequence = [];
        this.counts = {};
        this.timer = {};

        this.options = Reporter.getDefaultOptions();
        this.setOptions(options);

        if (!this.options.path) {
            throw new Error('Please provide options.path')
        }

        Reporter.makeDirectoryIfNeeded(this.options.path);

        this.destination = path.join(this.options.path, 'report.html');
    }

    /**
     * Handles jasmine started event
     * @param {Object} suiteInfo - Jasmine provided object
     */
    jasmineStarted(suiteInfo) {
        this.timer.jasmineStart = Reporter.nowString();
    };

    /**
     * Handles jasmine suite start event
     * @param {Object} result - Jasmine provided object
     */
    suiteStarted(result) {
    };

    /**
     * Handles jasmine spec started event
     * @param {Object} result - Jasmine provided object
     */
    specStarted(result) {
        result.started = Reporter.nowString();
    };

    /**
     * Handles jasmine spec done event
     * @param {Object} result - Jasmine provided object
     */
    specDone(result) {

        result.stoped = Reporter.nowString();
        result.prefix = result.fullName.replace(result.description, '');
        result.duration = new Date(result.stoped) - new Date(result.started);

        // suspectLine
        result.failedExpectations.forEach(failure => {
            failure.hasSuspectLine = failure.stack.split('\n').some(function (line) {
                let match = line.indexOf('Error:') === -1 && line.indexOf('node_modules') === -1;

                if (match) {
                    failure.suspectLine = line;
                }

                return match;
            });
        });

        this.sequence.push(result);
        this.counts[result.status] = (this.counts[result.status] || 0) + 1;

        if (this.options.writeReportEachSpec) {
            this.writeFile();
        }
    };

    /**
     * Handles jasmine suite done event
     * @param {Object} result - Jasmine provided object
     */
    suiteDone(result) {
    };

    /** Handles jasmine done event **/
    jasmineDone() {
        this.timer.jasmineDone = Reporter.nowString();
        this.writeFile();
    };

    /**
     * configure the options for the report
     * @param {Object} options - options for the reporter
     */
    setOptions(options) {
        this.options = Object.assign(this.options, options);
    };

    /** writes the report html to the options.path **/
    writeFile() {

        let logEntry = {
            options: this.options,
            timer: this.timer,
            counts: this.counts,
            sequence: this.sequence
        };

        let results = fileContents.replace('\'<Results Replacement>\'', JSON.stringify(logEntry, null, 4));
        fs.writeFileSync(this.destination, results, 'utf8');
    }

    static nowString() {
        return (new Date()).toISOString();
    }

    static getDefaultOptions() {
        return {
            writeReportEachSpec: true,
            showSuspectLine: true,
            highlightSuspectLine: true
        };
    }

    static makeDirectoryIfNeeded(path) {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
    }
}

module.exports = Reporter;