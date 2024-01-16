class AuthController {
  async login(req, res) {
    res.send("login");
  }
  async signup(req, res) {
    res.send("signup");
  }
  async logout(req, res) {
    res.send("logout");
  }
}

const authController = new AuthController();
module.exports = { authController };
