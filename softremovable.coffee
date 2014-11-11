af = Package['aldeed:autoform']
c2 = Package['aldeed:collection2']
ss = Package['aldeed:simple-schema']

defaults =
  removed: 'removed'
  removedAt: 'removedAt'
  removedBy: 'removedBy'
  restoredAt: 'restoredAt'
  restoredBy: 'restoredBy'

behaviour = (options = {}) ->

  {removed, removedAt, removedBy, restoredAt, restoredBy} =
    _.defaults options, defaults

  if ss?
    SimpleSchema = ss.SimpleSchema

    afDefinition = autoform:
      omit: true

    addAfDef = (definition) ->
      _.extend definition, afDefinition

    c2Definition =
      denyInsert: true

    addC2Def = (definition) ->
      _.extend definition, c2Definition

    definition = {}

    def = definition[removed] =
      optional: true
      type: Boolean

    addAfDef def if af?

    if removedAt
      def = definition[removedAt] =
        optional: true
        type: Date

      addC2Def def if c2?

      addAfDef def if af?

    if removedBy
      def = definition[removedBy] =
        optional: true
        regEx: new RegExp "(#{SimpleSchema.RegEx.Id.source})|^0$"
        type: String

      addC2Def def if c2?

      addAfDef def if af?

    if restoredAt
      def = definition[restoredAt] =
        optional: true
        type: Date

      addAfDef def if af?

      addC2Def def if c2?

    if restoredBy
      def = definition[restoredBy] =
        optional: true
        regEx: new RegExp "(#{SimpleSchema.RegEx.Id.source})|^0$"
        type: String

      addAfDef def if af?

      addC2Def def if c2?

    @attachSchema new SimpleSchema definition

  beforeFindHook = (userId = '0', selector = {}, options = {}) ->
    isSelectorId = _.isString(selector) or '_id' of selector
    unless options.removed or isSelectorId or selector[removed]?
      selector[removed] =
        $exists: false

    @args[0] = selector
    return

  @before.find beforeFindHook
  @before.findOne beforeFindHook

  @before.update (userId = '0', doc, fieldNames, modifier, options) ->
    $set = modifier.$set ?= {}
    $unset = modifier.$unset ?= {}

    if $set[removed] and doc[removed]?
      return false

    if $unset[removed] and not doc[removed]?
      return false

    if $set[removed] and not doc[removed]?
      $set[removed] = true

      if removedAt
        $set[removedAt] = new Date

      if removedBy
        $set[removedBy] = userId

      if restoredAt
        $unset[restoredAt] = true

      if restoredBy
        $unset[restoredBy] = true

    if $unset[removed] and doc[removed]?
      $unset[removed] = true

      if removedAt
        $unset[removedAt] = true

      if removedBy
        $unset[removedBy] = true

      if restoredAt
        $set[restoredAt] = new Date

      if restoredBy
        $set[restoredBy] = userId

  isLocalCollection = @_connection is null

  throwIfSelectorIsntId = (selector, method) ->
    unless _.isString(selector) or '_id' of selector
      throw new Meteor.Error 403, 'Not permitted. Untrusted code may only ' +
        "#{method} documents by ID."

  @softRemove = (selector, callback) ->
    return 0 unless selector

    if Meteor.isClient and not isLocalCollection
      throwIfSelectorIsntId selector, 'softRemove'

    modifier =
      $set: $set = {}

    $set[removed] = true

    if Meteor.isServer or isLocalCollection
      ret = @update selector, modifier, multi: true, callback

    else
      ret = @update selector, modifier, callback

    if ret is false
      0
    else
      ret

  @restore = (selector, callback) ->
    return 0 unless selector

    if Meteor.isClient and not isLocalCollection
      throwIfSelectorIsntId selector, 'restore'

    modifier =
      $unset: $unset = {}

    $unset[removed] = true

    if Meteor.isServer or isLocalCollection
      selector[removed] = true
      ret = @update selector, modifier, multi: true, callback

    else
      ret = @update selector, modifier, callback

    if ret is false
      0
    else
      ret

CollectionBehaviours.define 'softRemovable', behaviour
