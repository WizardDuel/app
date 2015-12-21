var configuration = {
  "development": {
      "GameServer": "http://localhost:3000",
  },
  "production": {
      "GameServer": "https://wizardduel.herokuapp.com/",
  }
};

exports.config = function() {
  var node_env = process.env.NODE_ENV || 'development';
  return configuration[node_env];
};