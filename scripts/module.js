const MODULE_NAME = 'foundryvtt-custom-classes'
const SETTING_NAME = 'classesOverride'

function log(data) {
  console.log("Foundry VTT | Custom Classes", data)
}

Hooks.once('ready', async function () {
  game.settings.register(MODULE_NAME, SETTING_NAME, {
    scope: 'world',
    config: false,
    type: Object,
    default: convertToData(CONFIG.DND5E.classFeatures),
  })

  game.settings.registerMenu("myModule", "mySettingsMenu", {
    name: "Custom Classes",
    label: "Manage custom classes",      // The text label used in the button
    hint: "Manage custom classes.",
    icon: "fas fa-cogs",               // A Font Awesome icon used in the submenu button
    type: CustomClassesApplication,   // A FormApplication subclass
    restricted: true                   // Restrict this submenu to gamemaster only?
  })
});

function convertToData(classFeatures) {
  return {
    classes: names(classFeatures).map(className => {
      const clazz = classFeatures[className]
      return {
        name: className,
        paths: names(clazz.subclasses).map(subclassName => {
          const subclass = clazz.subclasses[subclassName]
          const features = subclass.features;
          return {
            name: subclassName,
            levels: names(features).map(level => ({
              level: level,
              features: features[level],
            }))
          }
        }),
      }
    })
  }
}

function names(originalObj) {
  const names = []
  for (let it in originalObj) {
    names.push(it)
  }
  return names
}

class CustomClassesApplication extends FormApplication {

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
    return game.settings.get(MODULE_NAME, SETTING_NAME);
  }

  _updateObject(event, formData) {
    const data = expandObject(formData);
    log(data);
    // game.settings.set('myModuleName', 'myComplexSettingName', data);
  }
}
