const FrontConsole = (userConfig, userTasks) => {

  const defaultConfig = {
    shortcutActivator: "ctrl", //options: "ctrl", "ctrl+shift", "ctrl+alt"
    shortcutKeyCode: 192
  }

  const config = Object.assign(
    defaultConfig,
    userConfig
  )

  const defaultTasks = {
    "echo": {
      job: (params) => {
        console.log(params[0]);
      }
    },
    "add": {
      job: (params) => {
        console.log(params[0] + params[1]);
      }
    }
  }

  const tasks = Object.assign(
    defaultTasks,
    userTasks
  )

  const keyDownHandler = function(event) {
    onKeyDown(event);
  }

  const onKeyDown = function(event){
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
      console.log("open!")
    }
  }

  const instantiate = () => {
      document.addEventListener('keydown', keyDownHandler);
  }

  instantiate();

  return {
    config,
    tasks
  }

}
