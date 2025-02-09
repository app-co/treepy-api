/* eslint-disable func-names */
module.exports = function (plop) {
  // cria um novo componente
  plop.setGenerator('Novo Componente', {
    description: 'Gerador para criar um novo componente node',
    prompts: [
      {
        type: 'input',
        name: 'model',
        message: 'Qual o nome da tabela',
      },

      // {
      //   type: 'input',
      //   name: 'rota',
      //   message: 'Qual o nome da rota',
      // },

      {
        type: 'list',
        name: 'tipoAcao',
        message: 'Qual tipo de ação você quer criar?',
        choices: ['service', 'full-api'],
      },
    ],
    actions(dados) {
      let actions = [];

      // adiciona uma ação com base na escolha do usuário
      if (dados.tipoAcao === 'service') {
        actions = [
          {
            type: 'add',
            path: '../src/modules/{{model}}/services/{{service}}.ts',
            templateFile: 'templates/service.ts.hbs',
          },
        ];
      } else if (dados.tipoAcao === 'full-api') {
        actions = [
          {
            type: 'add',
            path: '../src/modules/{{model}}/service.ts',
            templateFile: 'templates/services.ts.hbs',
          },

          {
            type: 'add',
            path: '../src/modules/{{model}}/controller.ts',
            templateFile: 'templates/controler.ts.hbs',
          },

          {
            type: 'add',
            path: '../src/modules/{{model}}/routes.ts',
            templateFile: 'templates/routes.ts.hbs',
          },
        ];
      } else if (dados.tipoAcao === 'page-app') {
        actions = [
          {
            type: 'add',
            path: '../src/pages/{{name}}/index.tsx',
            templateFile: 'templates/index.tsx.hbs',
          },

          {
            type: 'add',
            path: '../src/pages/{{name}}/styles.ts',
            templateFile: 'templates/styles.ts.hbs',
          },
        ];
      }

      return actions;
    },
  });
};
