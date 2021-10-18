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
    default: CONFIG.DND5E.classFeatures,
  })

  game.settings.registerMenu("myModule", "mySettingsMenu", {
    name: "Custom Classes",
    label: "Manage custom classes",
    hint: "Manage custom classes.",
    icon: "fas fa-cogs",
    type: CustomClassesApplication,
    restricted: true,
  })
})

class CustomClassesApplication extends FormApplication {

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: "modules/foundryvtt-custom-classes/templates/settings.hbs",
      title: "CUSTOM_CLASSES.CustomClassesTitle",
      width: 800,
      height: "auto",
      resizable: true,
    })
  }

  getData() {
    const classFeatures = game.settings.get(MODULE_NAME, SETTING_NAME)
    log(classFeatures)
    return {classFeatures: classFeatures}
  }

  _updateObject(event, formData) {
    const data = expandObject(formData)
    log(data)
    // game.settings.set('myModuleName', 'myComplexSettingName', data)
  }
}
