const FrontConsole = (userConfig, userTasks) => {

  let consoleDOM = {};
  let consoleState = {};

  const defaultConfig = {
    shortcutActivator: "ctrl", //options: "ctrl", "ctrl+shift", "ctrl+alt"
    shortcutKeyCode: 192
  }

  const config = Object.assign(
    defaultConfig,
    userConfig
  )

  const defaultTasks = {
    "echo": {//to be switched by backend command
      job: (params) => {
        console.log(params[0]);
      },
      desc: "Returns provided parameter"
    },
    "add": {//just for show
      job: (params) => {
        console.log(params[0] + params[1]);
      },
      desc: "Simply adds to numbers passed as parameters"
    },
    "clear": {//acually useful clientside command
      job: () => {
        console.log(`Clear the console`);
      },
      desc: "Clears console"
    },
    "help": {//acually useful clientside command
      job: () => displayHelp(),
      desc: "This help"
    },
    //todo: "history" based on localstorage
  }

  const tasks = Object.assign(
    defaultTasks,
    userTasks
  )

  const displayHelp = () => {
    Object.keys(tasks).forEach((key)=>{
      const name = key;
      const desc = tasks[key].desc;
      console.log(`${name}: ${desc? desc : ""}`)
    })
  }

  const keyDownHandler = (event) => {
    onKeyDown(event);
  }

  const onKeyDown = (event) => {
    let shortcutActivatorEnabled = false;
    switch (config.shortcutActivator){
      case "ctrl":
        if (event.ctrlKey && !event.altKey && !event.shiftKey){
              shortcutActivatorEnabled = true;
            }
        break;
      case "ctrl+shift":
        if (event.ctrlKey && !event.altKey && event.shiftKey){
              shortcutActivatorEnabled = true;
            }
        break;
      case "ctrl+alt":
        if (event.ctrlKey && event.altKey && !event.shiftKey){
              shortcutActivatorEnabled = true;
            }
        break;
    }
    if (shortcutActivatorEnabled && event.keyCode === config.shortcutKeyCode){
      console.log("open!");
      if(consoleDOM.ctrlEl.style.display === "none"){
        consoleDOM.ctrlEl.style.display = "block";
      } else {
        consoleDOM.ctrlEl.style.display = "none";
      }

    }
  }

  const createDOMElements = () => {

      //Create & store CLI elements
      consoleDOM.ctrlEl   = document.createElement("div");   //CLI control (outer frame)
      consoleDOM.outputEl = document.createElement("div");   //Div holding console output
      consoleDOM.inputEl  = document.createElement("input"); //Input control
      consoleDOM.busyEl   = document.createElement("div");   //Busy animation

      //Add classes
      consoleDOM.ctrlEl.className   = "frontconsole";
      consoleDOM.outputEl.className = "frontconsole-output";
      consoleDOM.inputEl.className  = "frontconsole-input";
      consoleDOM.busyEl.className   = "frontconsole-busy";

      //Add attribute
      consoleDOM.inputEl.setAttribute("spellcheck", "false");

      //Assemble them
      consoleDOM.ctrlEl.appendChild(consoleDOM.outputEl);
      consoleDOM.ctrlEl.appendChild(consoleDOM.inputEl);
      consoleDOM.ctrlEl.appendChild(consoleDOM.busyEl);

      //Hide ctrl & add to DOM
      consoleDOM.ctrlEl.style.display = "none";
      document.body.appendChild(consoleDOM.ctrlEl);
  }

  const setBusy = (param) => {
    consoleState.busy = param;
    if (consoleState.busy){
      consoleDOM.busyEl.style.display = "block";
    } else {
      consoleDOM.busyEl.style.display = "none";
    }
  }

  const setFocus = () => {
      consoleDOM.inputEl.focus();
  }

  const instantiate = () => {
      createDOMElements();
      setBusy(false);
      setFocus();
      document.addEventListener('keydown', keyDownHandler);
  }

  instantiate();

  return {
    config,
    tasks,
    consoleDOM
  }

}
