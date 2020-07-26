const fs = require("fs");

module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    disableHostCheck: true,
    https: {
      key: fs.readFileSync("./localhost.key"),
      cert: fs.readFileSync("./localhost.cert")
    }
  }
};
