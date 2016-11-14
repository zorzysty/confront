# FrontConsole
Super handy console-like CLI for any kind of web app. No external dependencies.

## Installing
```
npm install frontconsole --save
```

### ES6 Import
```
import FrontConsole from "frontconsole";
FrontConsole();
```

### Script src
**It's strongly recommended to use ES6 Import instead of this**
You can use FrontConsole by simply adding script tag to your HTML:
```html
<script src="./node_modules/frontconsole/dist/frontconsole.js"></script>
```
It exposes window.FrontConsole and you can use it like this:
```javascript
FrontConsole.default();
```
### CSS
For console to work properly you need to style it with CSS. You can use default styles:
```html
<link rel="stylesheet" href="./node_modules/frontconsole/dist/frontconsole.css">
```

## Features
* Custom commands
* Supports promises, multiple arguments and flags 
* Sync and async error handling
* Tab auto-completion
* Command history with up and down arrows
* Type recognition

## Getting started

### Custom commands 
FrontConsole is pretty much useless until you power it up with your custom commands. You can pass them as the first argument when calling FrontConsole().
Let's create a simple command that adds together two numbers:
```javascript
FrontConsole({
    "add": {
        cmd: (args) => args[0] + args[1]
    }
});
```
Now when you open up FrontConsole in your app and type in
```
> add 1 2
3
```
Adding a custom command makes it visible in **help** - a build in command that lists all the available commands.
Specifying additional "help" key in "add" object will make it display in help:
```javascript
FrontConsole({
    "add": {
        cmd: (args) => args[0] + args[1],
        help: "Adds together two numbers"
    }
});
```
```
> help
add:            Adds together two numbers
clear:          Clears console 
clearhistory:   Clears history 
help:           This help
```
### Flags
Let's enhance "add" command a little by adding support for `-a` flag.
And while we're at it, let's do some code separation for better readability.
```javascript
function add(args, flags) {
    if (flags['a']) {
        return args.reduce((total, number) => total + number);
    } else {
        return args[0] + args[1];
    }
}
const commands: {
    "add": {
        cmd: (args, flags) => add(args, flags),
        help: "Adds together two numbers"
    }
}
FrontConsole(commands);
```
```
> add 1 2 3 4 5 -a
15
```
It also supports long flags, like `--limit`. Also all flags can have their own arguments. Here's the example:
```javascript
function add(args, shortFlags, longFlags) {
    if (shortFlags['a'] || longFlags['all']) {
        return args.reduce((total, number) => total + number);
    } else if (longFlags['limit']) {
        return args.slice(0, longFlags['limit']).reduce((total, number) => total + number);
    } else {
        return args[0] + args[1];
    }
}
const commands: {
    "add": {
        cmd: (args, flags) => add(args, flags),
        help: "Adds together two numbers"
    }
}
FrontConsole(commands);
```
```
> add 1 2 3 4 5 --limit 3
6
> add 1 2 3 4 5 --limit 1
1
> add 1 2 3 4 5 --limit 4
10
```
### Promises
FrontConsole was designed with promises in mind, so you don't have to worry about it. Console waits for promise to be resolved or rejected and in the meantime displays spinner animation. When the promise is fulfilled, it displays the result (if resolved) or error (if rejected).
Example:
```javascript
function promiseme() {
    return new Promise((resolve) => {
        setTimeout(function () {
            resolve(['from resolved promise', "dsadsada", '222', {"aaa": 22, "ss": 4}]);
        }, 2000)
    })
}

function rejectme() {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            reject("Promise rejected");
        }, 2000)
    })
}

const commands: {
    "promiseme": {
        cmd: () => promiseme(),
        desc: "returns promise (resolved)"
    },
    "rejectme": {
        cmd: () => rejectme(),
        desc: "returns promise (rejected)"
    },
}
FrontConsole(commands);
```
```
> promiseme
(spinner for two seconds)
[
  "from resolved promise",
  "list item",
  "222",
  {
    "aaa": 22,
    "ss": 4
  }
]
```
```
> rejectme
(spinner for two seconds)
(Error: ) Promise rejected
```
## Versioning
FrontConsole uses [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/zorzysty/FrontConsole/tags).

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
