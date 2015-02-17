# Soft remove for collections
[![Gitter](https://img.shields.io/badge/gitter-join_chat-brightgreen.svg)]
(https://gitter.im/zimme/meteor-collection-softremovable)
[![Code Climate](https://img.shields.io/codeclimate/github/zimme/meteor-collection-softremovable.svg)]
(https://codeclimate.com/github/zimme/meteor-collection-softremovable)

Add soft remove to collections.

This package uses `aldeed:simple-schema`, `aldeed:collection2` and `aldeed:autoform`
if they are available in the project.

### Install
```sh
meteor add zimme:collection-softremovable
```

### Usage

```js
Posts = new Mongo.Collection('posts');

//Default options
Posts.attachBehaviour('softRemovable');

//Custom options
Posts.attachBehaviour('softRemovable', {
  removed: 'deleted',
  removedAt: 'deletedAt',
  removedBy: false,
  restoredAt: 'undeletedAt',
  restoredBy: false
});

// Soft remove document by _id
Posts.softRemove({_id: 'BFpDzGuWG8extPwrE'});

// Restore document by _id
Posts.restore('BFpDzGuWG8extPwrE');

// Find all posts that are removed
Posts.find({removed: true});

// Find all posts including removed
Posts.find({}, {removed: true});
```

### Options

Available options are:

`removed`, `removedAt`, `removedBy`, `restoredAt`, `restoredBy`

Valid values are:

`'string'` will be used as field name.  
`false` field will be omitted.
