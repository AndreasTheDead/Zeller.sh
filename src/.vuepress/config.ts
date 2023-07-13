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
  head: [['link', {rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png'}],
    ['link', {rel: 'icon', type: 'image/png', sizes:'32x32', href: '/favicon-32x32.png'}],
    ['link', {rel: 'icon', type: 'image/png', sizes: '16x16', href:'/favicon-16x16.png'}],
    ['link', {rel: 'manifest', href: '/site.webmanifest'}],
    ['link', {rel: 'me', href: 'https://mastodon.social/@AndreasTheDead'}],
    ['link', {rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#322a28'}],
    ['meta', {name: 'apple-mobile-web-app-title', content: 'Zeller.sh'}],
    ['meta', {name: 'application-name', content: 'Zeller.sh'}],
    ['meta', {name: 'msapplication-TileColor', content: '#322a28'}],
    ['meta', {name: 'theme-color', content: '#322a28'}],
    ],

  theme,

  shouldPrefetch: false,
});
