const FrontConsole = (userConfig, userTasks) => {

  let consoleDOM = {};
  let consoleState = {
    history: [],
    rollback: 0,
  };
  let historyFromLocalStorage = JSON.parse(localStorage.getItem('fc-history'));

  if(historyFromLocalStorage && Array.isArray(historyFromLocalStorage)){
    consoleState.history = historyFromLocalStorage;
  }

  const defaultConfig = {
    shortcutActivator: "ctrl", //options: "ctrl", "ctrl+shift", "ctrl+alt"
    shortcutKeyCode: 192
  }

  const config = Object.assign(
    defaultConfig,
    userConfig
  )

  const defaultTasks = {
    "clear": {
      cmd: () => {
        consoleDOM.outputEl.innerHTML = "";
        return;
      },
      desc: "Clears console"
    },
    "clearhistory": {
      cmd: () => {
        consoleState.history = [];
        localStorage.setItem("fc-history", null);
        return "History cleared";
      },
      desc: "Clears history"
    },
    "help": {
      cmd: () => displayHelp(),
      desc: "This help"
    },
  }

  const tasks = Object.assign(
    defaultTasks,
    userTasks
  )

  const displayHelp = () => {
    const tableStart = '<table class="frontconsole-tbl">';
    const tableEnd = "</table>";
    let rows = [];
    Object.keys(tasks).forEach((key)=>{
      const name = key;
      const desc = tasks[key].desc;
      console.log(`${name}: ${desc? desc : ""}`);
      rows.push(`<tr><td class="frontconsole-lbl">${name}: </td><td class="frontconsole-val"> ${desc? desc : ""}</td>`);
    })
    const result = tableStart + rows.sort().join("") + tableEnd;
    return {html: result}
  }

  const keyDownHandler = (event) => {
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
      if(consoleDOM.ctrlEl.style.display === "none"){
        console.log("open!");
        consoleDOM.ctrlEl.style.display = "block";
        setFocus();
      } else {
        console.log("close!");
        consoleDOM.ctrlEl.style.display = "none";
      }

    }

    if(consoleState.busy) {
      return;
    }

    if(consoleDOM.inputEl === document.activeElement){
      switch (event.keyCode){
        case 13:
          consoleState.rollback = 0;
          executeCmd();
          break;
        case 38:
          event.preventDefault();
          if(consoleState.history.length - consoleState.rollback > 0){
              consoleState.rollback++;
              consoleDOM.inputEl.value = consoleState.history[consoleState.history.length - consoleState.rollback]
          }
          break;
        case 40:
          event.preventDefault();
          if(consoleState.rollback > 1){
              consoleState.rollback--;
              consoleDOM.inputEl.value = consoleState.history[consoleState.history.length - consoleState.rollback]
          } else if(consoleState.rollback === 1){
              consoleState.rollback = 0
              consoleDOM.inputEl.value = "";
          }
          break;
      }
    }
  }

  const clickHandler = (event) => {
    setFocus();
  }

  const executeCmd = () => {
    const inputValue = consoleDOM.inputEl.value.trim();

    if (inputValue === "") {
      return;
    } else {
      if(inputValue !== consoleState.history[consoleState.history.length - 1]){
        consoleState.history.push(inputValue);
        localStorage.setItem("fc-history", JSON.stringify(consoleState.history));
      }
      consoleDOM.inputEl.value = "";
      printLine(inputValue, "cmd");
    }


    //todo: to be refactored start:
    let commandParts = inputValue.match(/[^\s"]+|"[^"]*"/g);
    console.log(commandParts);
    commandParts.map(part => part.replace(/"/g), '');
    console.log(commandParts);
    //end

    const [cmd, ...args] = commandParts;

    if(tasks[cmd]){
      const cmdResult = tasks[cmd].cmd(args);

      if(cmdResult !== undefined){

        if(typeof cmdResult !== 'object'){
          printLine(String(cmdResult));
        } else if(cmdResult.html){
          printHTML(cmdResult.html);
        }
      }
    } else {
        printLine("No such command", "error");
        return;
    }
  }

  const printLine = (txt, type) => {
    let line = document.createElement("span");
    line.className = `frontconsole-${type? type: "default"}`;
    (type === "cmd")? txt = `> ${txt}`: txt;
    line.innerText = txt;
    consoleDOM.outputEl.appendChild(line);
    consoleDOM.outputEl.appendChild(document.createElement("br"));
    scrollToBottom();
  }

  const printHTML = (html) => {
    let lines = document.createElement("div");
    lines.innerHTML = html;
    consoleDOM.outputEl.appendChild(lines);
    scrollToBottom();
  }

  const scrollToBottom = () => {
    consoleDOM.ctrlEl.scrollTop = consoleDOM.ctrlEl.scrollHeight;
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
    console.log('setFocus called')
      consoleDOM.inputEl.focus();
  }

  const instantiate = () => {
      createDOMElements();
      setBusy(false);
      document.addEventListener('keydown', keyDownHandler);
      consoleDOM.ctrlEl.addEventListener('click', clickHandler);
  }

  instantiate();

  return {
    config,
    tasks,
    consoleDOM
  }

}
