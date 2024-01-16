class AuthController {
  async login(req, res) {}
  async signup(req, res) {}
  async logout(req, res) {}
}

const authController = new AuthController();
module.exports = { authController };
