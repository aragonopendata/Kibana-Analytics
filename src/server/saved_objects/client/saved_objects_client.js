'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SavedObjectsClient = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _mappings = require('../../mappings');

var _lib = require('./lib');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class SavedObjectsClient {
  constructor(kibanaIndex, mappings, callAdminCluster) {
    this.errors = _lib.errors;

    this._kibanaIndex = kibanaIndex;
    this._mappings = mappings;
    this._type = (0, _mappings.getRootType)(this._mappings);
    this._callAdminCluster = callAdminCluster;
  }

  /**
   * Persists an object
   *
   * @param {string} type
   * @param {object} attributes
   * @param {object} [options={}]
   * @property {string} [options.id] - force id on creation, not recommended
   * @property {boolean} [options.overwrite=false]
   * @returns {promise} - { id, type, version, attributes }
  */
  create(type, attributes = {}, options = {}) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const id = options.id;
      var _options$overwrite = options.overwrite;
      const overwrite = _options$overwrite === undefined ? false : _options$overwrite;


      const method = id && !overwrite ? 'create' : 'index';
      const response = yield _this._withKibanaIndex(method, {
        id: _this._generateEsId(type, id),
        type: _this._type,
        refresh: 'wait_for',
        body: {
          type,
          [type]: attributes
        }
      });

      return {
        id: (0, _lib.trimIdPrefix)(response._id, type),
        type,
        version: response._version,
        attributes
      };
    })();
  }

  /**
   * Creates multiple documents at once
   *
   * @param {array} objects - [{ type, id, attributes }]
   * @param {object} [options={}]
   * @property {boolean} [options.overwrite=false] - overwrites existing documents
   * @returns {promise} - [{ id, type, version, attributes, error: { message } }]
   */
  bulkCreate(objects, options = {}) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      var _options$overwrite2 = options.overwrite;
      const overwrite = _options$overwrite2 === undefined ? false : _options$overwrite2;


      const objectToBulkRequest = function objectToBulkRequest(object) {
        const method = object.id && !overwrite ? 'create' : 'index';

        return [{
          [method]: {
            _id: _this2._generateEsId(object.type, object.id),
            _type: _this2._type
          }
        }, {
          type: object.type,
          [object.type]: object.attributes
        }];
      };

      var _ref = yield _this2._withKibanaIndex('bulk', {
        refresh: 'wait_for',
        body: objects.reduce(function (acc, object) {
          return [...acc, ...objectToBulkRequest(object)];
        }, [])
      });

      const items = _ref.items;


      return items.map(function (response, i) {
        var _Object$values$ = Object.values(response)[0];
        const error = _Object$values$.error,
              responseId = _Object$values$._id,
              version = _Object$values$._version;
        var _objects$i = objects[i],
            _objects$i$id = _objects$i.id;
        const id = _objects$i$id === undefined ? responseId : _objects$i$id,
              type = _objects$i.type,
              attributes = _objects$i.attributes;


        if (error) {
          return {
            id,
            type,
            error: {
              message: error.reason || JSON.stringify(error)
            }
          };
        }

        return {
          id,
          type,
          version,
          attributes
        };
      });
    })();
  }

  /**
   * Deletes an object
   *
   * @param {string} type
   * @param {string} id
   * @returns {promise}
   */
  delete(type, id) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      const response = yield _this3._withKibanaIndex('delete', {
        id: _this3._generateEsId(type, id),
        type: _this3._type,
        refresh: 'wait_for'
      });

      if (response.found === false) {
        throw _lib.errors.decorateNotFoundError(_boom2.default.notFound());
      }
    })();
  }

  /**
   * @param {object} [options={}]
   * @property {string} [options.type]
   * @property {string} [options.search]
   * @property {Array<string>} [options.searchFields] - see Elasticsearch Simple Query String
   *                                        Query field argument for more information
   * @property {integer} [options.page=1]
   * @property {integer} [options.perPage=20]
   * @property {string} [options.sortField]
   * @property {string} [options.sortOrder]
   * @property {Array<string>} [options.fields]
   * @returns {promise} - { saved_objects: [{ id, type, version, attributes }], total, per_page, page }
   */
  find(options = {}) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      const type = options.type,
            search = options.search,
            searchFields = options.searchFields;
      var _options$page = options.page;
      const page = _options$page === undefined ? 1 : _options$page;
      var _options$perPage = options.perPage;
      const perPage = _options$perPage === undefined ? 20 : _options$perPage,
            sortField = options.sortField,
            sortOrder = options.sortOrder,
            fields = options.fields;


      if (searchFields && !Array.isArray(searchFields)) {
        throw new TypeError('options.searchFields must be an array');
      }

      if (fields && !Array.isArray(fields)) {
        throw new TypeError('options.searchFields must be an array');
      }

      const esOptions = {
        size: perPage,
        from: perPage * (page - 1),
        _source: (0, _lib.includedFields)(type, fields),
        body: _extends({
          version: true
        }, (0, _lib.getSearchDsl)(_this4._mappings, {
          search,
          searchFields,
          type,
          sortField,
          sortOrder
        }))
      };

      const response = yield _this4._withKibanaIndex('search', esOptions);

      return {
        page,
        per_page: perPage,
        total: response.hits.total,
        saved_objects: response.hits.hits.map(function (hit) {
          const type = hit._source.type;

          return {
            id: (0, _lib.trimIdPrefix)(hit._id, type),
            type,
            version: hit._version,
            attributes: hit._source[type]
          };
        })
      };
    })();
  }

  /**
   * Returns an array of objects by id
   *
   * @param {array} objects - an array ids, or an array of objects containing id and optionally type
   * @returns {promise} - { saved_objects: [{ id, type, version, attributes }] }
   * @example
   *
   * bulkGet([
   *   { id: 'one', type: 'config' },
   *   { id: 'foo', type: 'index-pattern' }
   * ])
   */
  bulkGet(objects = []) {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      if (objects.length === 0) {
        return { saved_objects: [] };
      }

      const response = yield _this5._withKibanaIndex('mget', {
        body: {
          docs: objects.map(function (object) {
            return {
              _id: _this5._generateEsId(object.type, object.id),
              _type: _this5._type
            };
          })
        }
      });

      return {
        saved_objects: response.docs.map(function (doc, i) {
          var _objects$i2 = objects[i];
          const id = _objects$i2.id,
                type = _objects$i2.type;


          if (doc.found === false) {
            return {
              id,
              type,
              error: { statusCode: 404, message: 'Not found' }
            };
          }

          return {
            id,
            type,
            version: doc._version,
            attributes: doc._source[type]
          };
        })
      };
    })();
  }

  /**
   * Gets a single object
   *
   * @param {string} type
   * @param {string} id
   * @returns {promise} - { id, type, version, attributes }
   */
  get(type, id) {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      const response = yield _this6._withKibanaIndex('get', {
        id: _this6._generateEsId(type, id),
        type: _this6._type
      });

      return {
        id,
        type,
        version: response._version,
        attributes: response._source[type]
      };
    })();
  }

  /**
   * Updates an object
   *
   * @param {string} type
   * @param {string} id
   * @param {object} [options={}]
   * @property {integer} options.version - ensures version matches that of persisted object
   * @returns {promise}
   */
  update(type, id, attributes, options = {}) {
    var _this7 = this;

    return _asyncToGenerator(function* () {
      const response = yield _this7._withKibanaIndex('update', {
        id: _this7._generateEsId(type, id),
        type: _this7._type,
        version: options.version,
        refresh: 'wait_for',
        body: {
          doc: {
            [type]: attributes
          }
        }
      });

      return {
        id,
        type,
        version: response._version,
        attributes
      };
    })();
  }

  _withKibanaIndex(method, params) {
    var _this8 = this;

    return _asyncToGenerator(function* () {
      try {
        return yield _this8._callAdminCluster(method, _extends({}, params, {
          index: _this8._kibanaIndex
        }));
      } catch (err) {
        throw (0, _lib.decorateEsError)(err);
      }
    })();
  }

  _generateEsId(type, id) {
    return `${type}:${id || _uuid2.default.v1()}`;
  }
}
exports.SavedObjectsClient = SavedObjectsClient;
SavedObjectsClient.errors = _lib.errors;
