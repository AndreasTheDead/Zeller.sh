import { searchPlugin } from "@vuepress/plugin-search";
import { defineUserConfig } from "vuepress";
import theme from "./theme.js";


// config https://vuepress-theme-hope.github.io/v2/cookbook/tutorial/config.html#config-scope
export default defineUserConfig({
  base: "/",
  title: "Zeller.sh",
  description: "Here I write about Projects or Topics I stumble about while building my Homelab.",
  
  plugins: [
    searchPlugin({
      // your options
    }),
  ],

  theme,

  shouldPrefetch: false,
});
