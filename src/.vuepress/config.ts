import { defineUserConfig } from "vuepress";
import theme from "./theme.js";


// config https://vuepress-theme-hope.github.io/v2/cookbook/tutorial/config.html#config-scope
export default defineUserConfig({
  base: "/",

  locales: {
    "/": {
      lang: "en-US",
      title: "Zeller.sh",
      description: "Here I write about Projects or Topics I stumble about while building my Homelab.",
    },
  },

  theme,

  shouldPrefetch: false,
});
