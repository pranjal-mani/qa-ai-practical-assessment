const testConfig = require('../test-data/test-config.json');

class AuthApi {
  constructor(request) {
    this.request = request;
    this.paths = testConfig.api.paths;
  }

  register(userBody) {
    return this.request.post(this.paths.register, { data: userBody });
  }

  login(email, password) {
    return this.request.post(this.paths.login, {
      data: { email, password },
    });
  }

  getMe(token) {
    return this.request.get(this.paths.me, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}

module.exports = { AuthApi };
