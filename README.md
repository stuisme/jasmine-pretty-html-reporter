# jasmine pretty html reporter

```
npm i jasmine-pretty-html-reporter --save-dev
```
_NOTE: jasmine is set as a peer dependency_


### Basic Setup

```
var Jasmine = require('jasmine');
var HtmlReporter = require('jasmine-pretty-html-reporter').Reporter;
var jasmine = new Jasmine();

jasmine.loadConfigFile('./spec/support/jasmine.json');

// options object
jasmine.addReporter(new HtmlReporter({
  path: path.join(__dirname,'results')
}));

jasmine.execute();
```

### Results