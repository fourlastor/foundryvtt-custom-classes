function log(data) {
  console.log("Foundry VTT | Custom Classes", data)
}

Hooks.once('ready', async function () {
  const originalClassFeatures = CONFIG.DND5E.classFeatures
  log(originalClassFeatures)
  CustomClassesApplication.originalClassFeatures = originalClassFeatures

  game.settings.registerMenu("myModule", "mySettingsMenu", {
    name: "Custom Classes",
    label: "Manage custom classes",      // The text label used in the button
    hint: "Manage custom classes.",
    icon: "fas fa-cogs",               // A Font Awesome icon used in the submenu button
    type: CustomClassesApplication,   // A FormApplication subclass
    restricted: true                   // Restrict this submenu to gamemaster only?
  })
  //   await game.settings.register('myModuleName', 'myComplexSettingName', {
  //     scope: 'world',     // "world" = sync to db, "client" = local storage
  //     config: false,      // we will use the menu above to edit this setting
  //     type: Object,
  //     default: {},        // can be used to set up the default structure
  //   });
});

class CustomClassesApplication extends FormApplication {

  static originalClassFeatures

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: "modules/foundryvtt-custom-classes/templates/settings.hbs",
      title: "CUSTOM_CLASSES.CustomClassesTitle",
      width: 800,
      height: "auto",
      resizable: true,
    });
  }

  getData() {
    // game.settings.get('myModuleName', 'myComplexSettingName');
    return this.convertToData(CONFIG.DND5E.classFeatures)
  }

  convertToData(classFeatures) {
    return {
      classes: this.names(classFeatures).map(className => {
        const clazz = classFeatures[className]
        return {
          name: className,
          paths: this.names(clazz.subclasses).map(subclassName => {
            const subclass = clazz.subclasses[subclassName]
            const features = subclass.features;
            return {
              name: subclassName,
              levels: this.names(features).map(level => ({
                level: level,
                features: features[level],
              }))
            }
          }),
        }
      })
    }
  }

  names(originalObj) {
    const names = []
    for (let it in originalObj) {
      names.push(it)
    }
    return names
  }

  _updateObject(event, formData) {
    const data = expandObject(formData);
    log(data);
    // game.settings.set('myModuleName', 'myComplexSettingName', data);
  }
}
