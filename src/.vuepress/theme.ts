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

  iconAssets: "fontawesome-with-brands",
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
  //docsDir: "docs",
  docsDir: "src",

  darkmode: "enable",
  //themeColor: {orange: "#b42000",
  //            blue: "#2196f3"},
  print: false,

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

  /*
  encrypt: {
    config: {
      "/demo/encrypt.html": ["1234"],
      "/zh/demo/encrypt.html": ["1234"],
    },
  },
  */
  
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
    //blog: true,
    blog:{
      excerpt: true,
      excerptSeparator: "<!-- more -->",
      excerptLength: 150,
    },
    // backToTop: true,
    /*
    comment: {
      // @ts-expect-error: You should generate and use your own comment service
      provider: "Giscus",
    },
    */
   /*
    prismjs: {
      themes: { 
        light: "one-light",
        dark: "one-dark" 
      },
      highlightLines: true,
    },
    */
    shiki: {
      themes:{
        light: "one-light",
        dark: "one-dark-pro" 
      },
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
        "FontIcon",
        "PDF",
        "VidStack"
      ]
    },
    /*comment: {
      provider: "Waline",
      serverURL: "https://comments.zeller.sh/",
      dark: "body.theme-dark",
      meta: ['nick','mail'],
      requiredMeta: ['nick'],
      login: "disable",
      reaction: false,
      wordLimit: 250
    },*/
    comment: false,
    sitemap: {
      changefreq: "weekly",
      excludePaths: ['/404.html','/LegalNotice.html']
    },

    markdownMath: {
      type: "katex"
    },

    markdownTab: {
      codeTabs: true,
      tabs: true
    },

    markdownImage: {
      figure: true,
      lazyload: true,
      mark: true,
      size: true
    },

    // all features are enabled for demo, only preserve features you need here
    mdEnhance: {
      align: true,
      attrs: true,
      chart: true,
      demo: false,
      echarts: true,
      flowchart: false,
      gfm: true,
      include: false,
      mark: true,
      mermaid: true,
      footnote: true,
      playground: {
        presets: ["ts", "vue"],
      },
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
      sub: true,
      sup: true,
      vPre: true,
      vuePlayground: false,
      //linkCheck: "dev",
    },
  },
});