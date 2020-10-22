module.exports = function (plop) {
  plop.setHelper('upperCase', function (text) {
    return text.charAt(0).toUpperCase() + text.slice(1)
  });

  plop.setGenerator('controller', {
    description: 'application controller',
    prompts: [{
      type: 'input',
      name: 'moduleName',
      message: 'controller name please'
    }],
    actions: [{
      type: 'add',
      path: './controllers/{{moduleName}}Controller.js',
      templateFile: 'plop-templates/controller.hbs'
    }],
  })
}
