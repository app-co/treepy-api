/* eslint-disable func-names */
module.exports = function (plop) {
  // cria um novo componente
  plop.setGenerator('Novo Componente', {
    description: 'Gerador para criar um novo componente React',
    prompts: [
      {
        type: 'input',
        name: 'error',
        message: 'Qual o nome do erro',
      },

      {
        type: 'input',
        name: 'errorText',
        message: 'Qual o texto do erro',
      },

      {
        type: 'input',
        name: 'db',
        message: 'Nome do banco de dados',
      },

      {
        type: 'input',
        name: 'controller',
        message: 'Nome do controller',
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
        choices: ['use-case', 'full-api', 'controller', 'error'],
      },
    ],
    actions(dados) {
      let actions = [];

      // adiciona uma ação com base na escolha do usuário
      if (dados.tipoAcao === 'use-case') {
        actions = [
          {
            type: 'add',
            path: '../src/modules/{{db}}/use-cases/{{db}}-cases.ts',
            templateFile: 'templates/use-cases.ts.hbs',
          },
        ];
      } else if (dados.tipoAcao === 'full-api') {
        actions = [
          {
            type: 'add',
            path: '../src/modules/{{db}}/use-cases/{{db}}-cases.ts',
            templateFile: 'templates/use-cases.ts.hbs',
          },

          {
            type: 'add',
            path: '../src/modules/{{db}}/repositories/Prisma{{pascalCase db}}.ts',
            templateFile: 'templates/prisma.ts.hbs',
          },

          {
            type: 'add',
            path: '../src/modules/{{db}}/repositories/repo-{{db}}.ts',
            templateFile: 'templates/repo.ts.hbs',
          },

          {
            type: 'add',
            path: '../src/modules/{{db}}/http/controller/{{controller}}.ts',
            templateFile: 'templates/controler.ts.hbs',
          },

          {
            type: 'add',
            path: '../src/modules/{{db}}/http/routes/index.ts',
            templateFile: 'templates/routes.ts.hbs',
          },

          {
            type: 'add',
            path: '../src/modules/{{db}}/errors/{{error}}.ts',
            templateFile: 'templates/error.ts.hbs',
          },
        ];
      } else if (dados.tipoAcao === 'error') {
        actions = [
          {
            type: 'add',
            path: '../src/modules/{{db}}/errors/{{error}}.ts',
            templateFile: 'templates/error.ts.hbs',
          },
        ];
      } else if (dados.tipoAcao === 'controller') {
        actions = [
          {
            type: 'add',
            path: '../src/modules/{{db}}/http/controller/{{controller}}.ts',
            templateFile: 'templates/controler.ts.hbs',
          },
        ];
      }

      return actions;
    },
  });
};
