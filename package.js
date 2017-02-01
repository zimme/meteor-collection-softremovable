Package.describe({
  git: 'https://github.com/lmachens/meteor-collection-softremovable.git',
  name: 'lmachens:collection-softremovable',
  summary: 'Add soft remove to collections',
  version: '1.0.7'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use([
    'check',
    'coffeescript',
    'underscore'
  ]);

  api.use([
    'matb33:collection-hooks@0.7.6',
    'zimme:collection-behaviours@1.0.3'
  ]);

  api.use([
    'aldeed:autoform@4.0.0 || 5.0.0',
    'aldeed:collection2@2.0.0',
    'aldeed:simple-schema@1.0.3'
  ], ['client', 'server'], {weak: true});

  api.imply('zimme:collection-behaviours');

  api.addFiles('softremovable.coffee');
});
