'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (server) {
  var _server$plugins$elast = server.plugins.elasticsearch.getCluster('admin');

  const callWithInternalUser = _server$plugins$elast.callWithInternalUser;

  const index = server.config().get('kibana.index');
  return callWithInternalUser('indices.create', {
    index: index,
    body: {
      settings: {
        number_of_shards: 1
      },
      mappings: server.getKibanaIndexMappingsDsl()
    }
  }).catch(() => {
    throw new Error(`Unable to create Kibana index "${index}"`);
  }).then(function () {
    return callWithInternalUser('cluster.health', {
      waitForStatus: 'yellow',
      index: index
    }).catch(() => {
      throw new Error(`Waiting for Kibana index "${index}" to come online failed.`);
    });
  });
};

module.exports = exports['default'];
