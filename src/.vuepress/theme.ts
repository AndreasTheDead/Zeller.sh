import { hopeTheme } from "vuepress-theme-hope";
import { DefaultNavbar } from "./menues/navbar.js";
//import { ArticleSidebar } from "./menues/sidebar.js"

//Theme Config https://vuepress-theme-hope.github.io/v2/config/theme/
export default hopeTheme({
  hostname: "https://zeller.sh",

  author: {
    name: "Andreas Zeller",
    url: "/whoami.html",
  },
  favicon: "/logo.png",

  //Navbar settings https://theme-hope.vuejs.press/config/theme/layout.html#navbar-config
  
  // navbarIcon: true,
  
  editLink: false,

  logo: "/logo.png",
  logoDark: "/logo.png",
  
  repo: "AndreasTheDead/Zeller.sh",
  repoDisplay: true,

  navbarAutoHide: "always",
  hideSiteNameOnMobile: true,

  // Set footer options
  displayFooter: true,
  footer: '<a href="/LegalNotice.html">Legal Notice</a>',

  // navbar
  navbar: DefaultNavbar,

  // sidebar https://theme-hope.vuejs.press/guide/layout/sidebar.html
  //sidebar: enSidebar, 
  sidebar: false,

  pageInfo: ["Author", "Date", "Category", "Tag"],
  docsDir: "src",
  darkmode: "enable",
  print: false,

  // MARK: Blog config
  blog: { //
    //sidebarDisplay: "always",
    description: "Product Expert IAM <br> Working on Intune, (Azure) Active Directory and whatever I find interest in.",
    intro: "/whoami.html",
    // roundAvatar: true,
    avatar: "/avatar.png",
    medias: {
      Email: "mailto:Andreas@zeller.sh",
      GitHub: "https://github.com/AndreasTheDead",
      Linkedin: "www.linkedin.com/in/andreas-zeller",
    },
  },

  // MARK: markdown config
  markdown: {
    gfm: true,
    footnote: true,
    vPre: true,
    include: false,
    align: true,
    attrs: true,
    mark: true,
    sup: true,
    sub: true,
    chartjs: true,
    echarts: true,
    flowchart: false,
    mermaid: true,
    demo: false,
    vuePlayground: false,
    figure: true,
    imgLazyload: true,
    imgMark: true,
    imgSize: true,
    stylize: [
      {
        matcher: "Recommended",
        replacer: ({ tag }) => {
          if (tag === "em")
            return {
              tag: "Badge",
              attrs: { type: "tip" },
              content: "Recommended",
            };
        },
      },
    ],
    playground: {
      presets: ["ts", "vue"],
    },
    math: {
      type: "katex"
    },
    codeTabs: true,
    tabs: true,
    highlighter: {
      type: "shiki",
      themes:{
        light: "one-light",
        dark: "one-dark-pro" 
      },
    },
  },
  // MARK: plugin config
  plugins: {
    git:{
      contributors: false,
      updatedTime: true
    },
    search:{
      locales: {
        '/': {
          placeholder: "Search"
        }
      },
      hotKeys: ['s','/']
    },
    icon:{
      assets: "fontawesome-with-brands"
    },
    //blog: true,
    blog:{
      excerpt: true,
      excerptSeparator: "<!-- more -->",
      excerptLength: 150,
    },
    copyright: {
      global: false,
    },
    feed:{
      atom: true,
      atomOutputFilename: "atom.xsl",
      rss: true,
      rssOutputFilename: "rss.xml",
    },
    components:{
      components: [
        "Badge",
        "PDF",
        "VidStack"
      ]
    },
    comment: false,
    sitemap: {
      changefreq: "weekly",
      excludePaths: ['/404.html','/LegalNotice.html']
    },
  },
});