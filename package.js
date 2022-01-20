Package.describe({
  git: 'https://github.com/ricaragao/meteor-collection-softremovable.git',
  name: 'raragao:collection-softremovable',
  summary: 'Add soft remove to collections',
  version: '1.0.9',
  documentation: 'README.md',
});

Package.onUse(function (api) {
  api.versionsFrom('1.8');

  api.use('ecmascript');

  api.use([
    'check',
    'underscore',
  ]);

  api.use([
    'matb33:collection-hooks@1.1.0',
    'zimme:collection-behaviours@1.1.2'
  ]);

  api.use([
    'aldeed:autoform@6.3.0 || 7.0.0',
    'aldeed:collection2@2.0.0 || 3.0.0',
  ], ['client', 'server'], { weak: true });

  api.imply('zimme:collection-behaviours');

  api.mainModule('softremovable.js');

});

