# ConFront
Super handy, fully customizable CLI for the web. Think of it as a command line of your operating system that you know and love, but inside your web app.

## Description
ConFront is designed for (but not limited to) web app admins to help them save time by converting their everyday tasks into simple, easy to remember, customizable commands.
These commands can utilize REST API functions that are already in your app.

Let's say your web app has an administration page where admin can log in and perform some repeatable tasks. This page contains:
* Clear cache button
* Add user form
* Edit user form
* Backup database form with some checkboxes for additional options
All of these send REST requests to the backend using promises. After promise is resolved/rejected proper notification is displayed containing server response.

This is where ConFront comes in. You can perform the same tasks but much quicker and simpler. Just like using command line in your operating system. Just open ConFront (`` CTRL+` `` on Win/Linux or `` Control+` `` on mac) and enter your command. For example: 
| Task | Example command |
| ---- | -------------------------- |
| Clear cache | `clearcache` |
| Add user | `adduser "John Smith" --group Users` |
| Change user permissions and email | `changeuser 123456 --group Admins --email newemail@example.com` |
| Backup database | `db backup` |
| Backup database (with additional flags) | `db backup -anq` | 

## Features
* Custom commands
* Supports promises, multiple arguments and flags 
* Sync and async error handling
* Tab auto-completion
* Command history with up and down arrows
* Works with every framework
* Type recognition
* No external dependencies

## Installing
```
npm install confront --save
```

### ES6 Import
```
import ConFront from "confront";
ConFront();
```

### Script src
**It's strongly recommended to use ES6 Import instead of this**
You can use ConFront by simply adding script tag to your HTML:
```html
<script src="./node_modules/confront/dist/confront.js"></script>
```
It exposes window.ConFront and you can use it like this:
```javascript
ConFront.default();
```
### CSS
For ConFront to work properly you need to style it with CSS. You can use default styles:
```html
<link rel="stylesheet" href="./node_modules/confront/dist/confront.css">
```

## Getting started
After you have ConFront running, open your app and simply press `` CTRL+` `` (Windows/Linux) or `` Control+` `` (macOS). This shortcut can be [configured](#Configuration). 
Type in `help` and press Enter/Return to see all the currently available commands. 

### Custom commands 
ConFront is pretty much useless until you power it up with your custom commands. You can pass them as the first argument when calling ConFront().
Let's create a simple command that adds together two numbers:
```javascript
ConFront({
    "add": {
        cmd: (args) => args[0] + args[1]
    }
});
```
Now when you open up ConFront in your app and type in
```
> add 1 2
3
```
Adding a custom command makes it visible in **help** - a build in command that lists all the available commands.
Specifying additional "desc" key in "add" object will make it display in help:
```javascript
ConFront({
    "add": {
        cmd: (args) => args[0] + args[1],
        desc: "Adds together two numbers"
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
        desc: "Adds together two numbers"
    }
}
ConFront(commands);
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
        desc: "Adds together two numbers"
    }
}
ConFront(commands);
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
ConFront was designed with promises in mind, so you don't have to worry about it. ConFront waits for promise to be resolved or rejected and in the meantime displays spinner animation. When the promise is fulfilled, it displays the result (if resolved) or error (if rejected).
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
ConFront(commands);
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
### HTML
Your command can also return HTML which will be displayed inside ConFront. ConFront will try to guess if the returned valuse is HTML, but you can spare it the work by setting type to "html". It's useful especially when we need to format result, for example using table:
```
const displayHelp = () => {
	const tableStart = "<table class='confront-table'>";
	const tableEnd = "</table>";
	let rows = [];
	Object.keys(tasks).forEach((key) => {
		const name = key;
		const desc = tasks[key].desc;
		rows.push(`<tr><td class="confront-label">${name}: </td><td class="confront-value">${desc ? desc : ""}</td>`);
	});
	return tableStart + rows.sort().join("") + tableEnd;
};
const commands = {
    "help": {
        cmd: () => displayHelp(),
        desc: translation["desc.help"],
        type: "html",
    },
}
ConFront(commands);
```

## Configuration
Custom configuration can be passed as a second argument to ConFront. Right now it allows to change three basic values. Here's the example:
```javascript
const config = {
    shortcutActivator: "ctrl",
    shortcutKeyCode: 220,
    convertTypes: false,
};
ConFront(commands, config);
```
| Parameter     | Description   | Possible options | Default |
| ------------ | ------------- | --------------- | ------- |
| shortcutActivator      | Key to be pressed to activate shortcut| "ctrl", "ctrl+shift", "ctrl+alt" | "ctrl" |
| shortcutKeyCode      | Code of the key to be pressed when activator enabled      | See [keycode.info](http://keycode.info) | 220 |
| convertTypes | Automatically convert types from string   | true, false | true |

## Translation
There are some build in strings that can be translated. Custom translation can be passed as a third argument to ConFront:
```javascript
const translation = {
    "err.cmdNotFound": "Custom command not found translation"
};
ConFront(commands, config, translation);
```
Here are all the default values:
```javascript
{
	"desc.clear": "Clears console",
	"desc.clearHistory": "Clears history",
	"desc.help": "This help",
	"err.cmdNotFound": "Command not found",
	"historyCleared": "History cleared",
}
```

## Use cases
ConFront is designed to help web app admins save time by simplifying their everyday tasks into easy to remember, customizable commands.
These command can utilize REST API functions that are already in your app.
| Task | Example command |
| ---- | -------------------------- |
| Clear cache | `clearcache` | 
| Add user | `adduser "John Smith" --group Users` | 
| Change user permissions and email | `changeuser 123456 --group Admins --email newemail@example.com` | 
| Backup database | `db backup` | 
| Backup database (with additional flags) | `db backup -anq` | 

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
