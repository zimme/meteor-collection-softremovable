[![Gitter](https://img.shields.io/badge/gitter-join_chat-brightgreen.svg)]
(https://gitter.im/zimme/meteor-collection-softremovable)
[![Code Climate](https://img.shields.io/codeclimate/github/zimme/meteor-collection-softremovable.svg)]
(https://codeclimate.com/github/zimme/meteor-collection-softremovable)

# Soft remove for collections

Add soft remove to collections.

### Install
```sh
meteor add zimme:collection-softremovable
```

### Usage

Basic usage examples.

#### Attach

```js
Posts = new Mongo.Collection('posts');

//Attach behaviour with the default options
Posts.attachBehaviour('softRemovable');

//Attach behaviour with custom options
Posts.attachBehaviour('softRemovable', {
  removed: 'deleted',
  removedBy: false,
  restoredAt: 'undeletedAt',
  restoredBy: false
});
```

#### Remove/Restore

```js
// Soft remove document by _id
Posts.softRemove({_id: 'BFpDzGuWG8extPwrE'});

// Restore document by _id
Posts.restore('BFpDzGuWG8extPwrE');

// Actually remove document from collection
Posts.remove({_id: 'BFpDzGuWG8extPwrE'});
```

#### Find

```js
// Find all posts except soft removed posts
Posts.find({});

// Find only posts that have been soft removed
Posts.find({removed: true});

// Find all posts including removed
Posts.find({}, {removed: true});
```

### Options

The following options can be used:

* `removed`: Optional. Set to `'string'` to change the fields name.
  This field can't be omitted.

* `removedAt`: Optional. Set to `'string'` to change the fields name.
  Set to `false` to omit field.

* `removedBy`: Optional. Set to `'string'` to change the fields name.
  Set to `false` to omit field.

* `restoredAt`: Optional. Set to `'string'` to change the fields name.
  Set to `false` to omit field.

* `restoredBy`: Optional. Set to `'string'` to change the fields name.
  Set to `false` to omit field.

* `systemId`: Optional. Set to `'string'` to change the id representing the
  system.

### Global configuration

```js
// Configure behaviour globally
// All collection using this behaviour will use these settings as defaults
// The settings below are the package default settings
CollectionBehaviours.configure('softRemovable',{
  removed: 'removed',
  removedAt: 'removedAt',
  removedBy: 'removedBy',
  restoredAt: 'restoredAt',
  restoredBy: 'restoredAt',
  systemId: '0'
});
```

### Notes

* Don't forget to publish the soft removed documents, if you need them on the
  client. A regular `.find()` in a publish function won't find soft removed
  documents. See the [Find](#find) usage examples.

```
if ( Meteor.isServer ) {
  Meteor.publish("collection", function () {
    return Collection.find({ user: this.userId }, { removed: true });
    //                       Include removed in initial load ^
  });
}

if ( Meteor.isClient ) { Meteor.subscribe("collection"); }
```

* This package attaches a schema to the collection if `aldeed:simple-schema`,
  `aldeed:collection2` and/or `aldeed:autoform` are used in the application.
