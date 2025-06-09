const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    allowedHosts: ["words.local", "dev.words.local"],
    port: 8081, // o el puerto que prefieras
  },
});
