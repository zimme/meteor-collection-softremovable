import SimpleSchema from "simpl-schema";
const af = Package['aldeed:autoform'];
const c2 = Package['aldeed:collection2'];
SimpleSchema.extendOptions(['autoform']);

const defaults = {
  removed: 'removed',
  removedAt: 'removedAt',
  removedBy: 'removedBy',
  restoredAt: 'restoredAt',
  restoredBy: 'restoredBy',
  systemId: '0'
};

const behaviour = function (options) {

  if (options == null) { options = {}; }
  check(options, Object);

  const { removed, removedAt, removedBy, restoredAt, restoredBy, systemId } =
    _.defaults(options, this.options, defaults);

  if (c2 != null) {
    const afDefinition = {
      autoform: {
        omit: true
      }
    };

    const addAfDef = definition => _.extend(definition, afDefinition);

    const definition = {};

    let def = (definition["removed"] = {
      optional: true,
      type: Boolean
    });

    if (af != null) { addAfDef(def); }

    if (removedAt) {
      def = (definition["removedAt"] = {
        // denyInsert: true,
        optional: true,
        type: Date
      });

      if (af != null) { addAfDef(def); }
    }


    const regEx = new RegExp(`(${SimpleSchema.RegEx.Id.source})|^${systemId}$`);

    if (removedBy) {
      def = (definition["removedBy"] = {
        // denyInsert: true,
        optional: true,
        regEx,
        type: String
      });

      if (af != null) { addAfDef(def); }
    }

    if (restoredAt) {
      def = (definition["restoredAt"] = {
        // denyInsert: true,
        optional: true,
        type: Date
      });

      if (af != null) { addAfDef(def); }
    }

    if (restoredBy) {
      def = (definition["restoredBy"] = {
        // denyInsert: true,
        optional: true,
        regEx,
        type: String
      });

      if (af != null) { addAfDef(def); }
    }
    this.collection.attachSchema(new SimpleSchema(definition));
  }

  const beforeFindHook = function (userId, selector, options) {
    if (userId == null) { userId = systemId; }
    if (options == null) { options = {}; }
    if (!selector) { return; }
    if (_.isString(selector)) {
      selector =
        { _id: selector };
    }

    if (Match.test(selector, Object) && !(options.removed || (selector["removed"] != null))) {
      selector["removed"] = { "$exists": false };
    }

    this.args[0] = selector;
  };

  this.collection.before.find(beforeFindHook);
  this.collection.before.findOne(beforeFindHook);

  this.collection.before.update(function (userId, doc, fieldNames, modifier, options) {

    if (userId == null) { userId = systemId; }
    const $set = modifier.$set != null ? modifier.$set : (modifier.$set = {});
    const $unset = modifier.$unset != null ? modifier.$unset : (modifier.$unset = {});

    if ($set["removed"] && (doc["removed"] != null)) {
      return false;
    }

    if ($unset["removed"] && (doc["removed"] == null)) {
      return false;
    }

    if ($set["removed"] && (doc["removed"] == null)) {
      $set["removed"] = true;

      if (removedAt) {
        $set["removedAt"] = new Date;
      }

      if (removedBy) {
        $set["removedBy"] = userId;
      }

      if (restoredAt) {
        $unset["restoredAt"] = true;
      }

      if (restoredBy) {
        $unset["restoredBy"] = true;
      }
    }

    if ($unset["removed"] && (doc["removed"] != null)) {
      $unset["removed"] = true;

      if (removedAt) {
        $unset["removedAt"] = true;
      }

      if (removedBy) {
        $unset["removedBy"] = true;
      }

      if (restoredAt) {
        $set["restoredAt"] = new Date;
      }

      if (restoredBy) {
        $set["restoredBy"] = userId;
      }
    }

    if (_.isEmpty($set)) {
      delete modifier.$set;
    }

    if (_.isEmpty($unset)) {
      return delete modifier.$unset;
    }
  });

  const isLocalCollection = this.collection._connection === null;

  this.collection.softRemove = function (selector, callback) {
    let $set, ret;
    if (!selector) { return 0; }

    const modifier =
      { $set: ($set = {}) };

    $set["removed"] = true;

    try {
      if (Meteor.isServer || isLocalCollection) {
        ret = this.update(selector, modifier, { multi: true }, callback);

      } else {
        ret = this.update(selector, modifier, callback);
      }

    } catch (error) {
      if (error.reason.indexOf('Not permitted.' !== -1)) {
        throw new Meteor.Error(403, 'Not permitted. Untrusted code may only ' +
          "softRemove documents by ID."
        );
      }
    }

    if (ret === false) {
      return 0;
    } else {
      return ret;
    }
  };

  return this.collection.restore = function (selector, callback) {
    let $unset, ret;
    if (!selector) { return 0; }

    const modifier =
      { $unset: ($unset = {}) };

    $unset["removed"] = true;

    try {
      if (Meteor.isServer || isLocalCollection) {
        selector = _.clone(selector);
        selector["removed"] = true;
        ret = this.update(selector, modifier, { multi: true }, callback);

      } else {
        ret = this.update(selector, modifier, callback);
      }

    } catch (error) {
      if (error.reason.indexOf('Not permitted.' !== -1)) {
        throw new Meteor.Error(403, 'Not permitted. Untrusted code may only ' +
          "restore documents by ID."
        );
      }
    }

    if (ret === false) {
      return 0;
    } else {
      return ret;
    }
  };
};

CollectionBehaviours.define('softRemovable', behaviour);