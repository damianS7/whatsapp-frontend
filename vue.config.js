const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    allowedHosts: ["whatsapp.local", "dev.whatsapp.local"],
    port: 8081, // o el puerto que prefieras
  },
});
