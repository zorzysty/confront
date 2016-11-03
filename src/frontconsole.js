const FrontConsole = (userConfig) => {

  const defaultConfig = {
    shortcutActivator: "ctrl", //options: "ctrl", "ctrl+shift", "ctrl+alt"
    shortcutKeyCode: 192
  }

  const config = Object.assign(
    defaultConfig,
    userConfig
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
    config
  }

}
