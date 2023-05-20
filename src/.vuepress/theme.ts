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
  
  navbarIcon: true,
  
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

  darkmode: "switch",
  //themeColor: {orange: "#b42000",
  //            blue: "#2196f3"},
  backToTop: true,
  print: false,

  blog: { //
    //sidebarDisplay: "always",
    description: "Junior System Engineer <br> Working on Intune, (Azure) Active Directory and whatever I find interest in.",
    intro: "/whoami.html",
    roundAvatar: true,
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
    //blog: true,
    blog:{
      excerpt: true,
      excerptSeparator: "<!-- more -->",
      excerptLength: 150,
    },

    /*
    comment: {
      // @ts-expect-error: You should generate and use your own comment service
      provider: "Giscus",
    },
    */
    prismjs: {
      dark: "one-dark",
      light: "one-light",
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
        "YouTube"
      ]
    },
    comment: {
      provider: "Waline",
      serverURL: "https://comments.zeller.sh/",
      dark: "body.theme-dark",
      meta: ['nick','mail'],
      requiredMeta: ['nick'],
      login: "disable",
      reaction: false,
      wordLimit: 250
    },


    // all features are enabled for demo, only preserve features you need here
    mdEnhance: {
      align: true,
      attrs: true,
      chart: true,
      codetabs: true,
      container: true,
      demo: false,
      echarts: true,
      figure: true,
      flowchart: true,
      gfm: true,
      imgLazyload: true,
      imgSize: true,
      include: false,
      katex: true,
      mark: true,
      mermaid: true,
      footnote: true,
      playground: {
        presets: ["ts", "vue"],
      },
      presentation: {
        plugins: ["highlight", "math", "search", "notes", "zoom"],
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
      tabs: true,
      vPre: true,
      vuePlayground: false,
      //linkCheck: "dev",
    },
  },
});