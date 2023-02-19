import { hopeTheme } from "vuepress-theme-hope";
import { enNavbar, zhNavbar } from "./navbar/index.js";
import { enSidebar, zhSidebar } from "./sidebar/index.js";

//Theme Config https://vuepress-theme-hope.github.io/v2/config/theme/
export default hopeTheme({
  hostname: "https://zeller.sh",

  author: {
    name: "Andreas Zeller",
    url: "https://zeller.sh",
  },

  iconAssets: "iconfont",
  favicon: "/logo.png",
  logo: "/logo.svg",

  repoDisplay: true,
  repo: "AndreasTheDead/Zeller.sh",

  navbarAutoHide: "always",

  pageInfo: ["Author", "Date", "Category", "Tag", "ReadingTime"],
  docsDir: "docs",

  darkmode: "switch",
  //themeColor: {orange: "#b42000",
  //            blue: "#2196f3"},
  backToTop: true,
  print: false,

  blog: {
    medias: {
      Email: "mailto:Andreas@zeller.sh",
      GitHub: "https://github.com/AndreasTheDead",
      Linkedin: "www.linkedin.com/in/andreas-zeller",
    },
  },

  locales: {
    "/": {
      // navbar
      navbar: enNavbar,

      // sidebar
      sidebar: enSidebar,

      footer: "Default footer",

      displayFooter: true,

      blog: {
        description: "Junior System Engineer <br> Working on Intune, (Azure) Active Directory and whatever I find intresting about.",
        //intro: "/intro.html",
        roundAvatar: true,
        avatar: "/avatar.png",
      },

      metaLocales: {
        editLink: "Edit this page on GitHub",
      },
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
    //blog: true,
    blog:{
      excerpt: true,
      excerptSeparator: "<!-- more -->",
      excerptLength: 300,
    },

    /*
    comment: {
      // @ts-expect-error: You should generate and use your own comment service
      provider: "Giscus",
    },
    */

    copyright: {
      author: "Andreas Zeller",
      global: true,
    },
    feed:{
      atom: true,
      atomOutputFilename: "atom.xsl",
      rss: true,
      rssOutputFilename: "rss.xml",
    },


    // all features are enabled for demo, only preserve features you need here
    mdEnhance: {
      align: true,
      attrs: true,
      chart: true,
      codetabs: true,
      container: true,
      demo: true,
      echarts: true,
      figure: true,
      flowchart: true,
      gfm: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      katex: true,
      mark: true,
      mermaid: true,
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
      vuePlayground: true,
    },

    // uncomment these if you want a PWA
    // pwa: {
    //   favicon: "/favicon.ico",
    //   cacheHTML: true,
    //   cachePic: true,
    //   appendBase: true,
    //   apple: {
    //     icon: "/assets/icon/apple-icon-152.png",
    //     statusBarColor: "black",
    //   },
    //   msTile: {
    //     image: "/assets/icon/ms-icon-144.png",
    //     color: "#ffffff",
    //   },
    //   manifest: {
    //     icons: [
    //       {
    //         src: "/assets/icon/chrome-mask-512.png",
    //         sizes: "512x512",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-mask-192.png",
    //         sizes: "192x192",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //     ],
    //     shortcuts: [
    //       {
    //         name: "Demo",
    //         short_name: "Demo",
    //         url: "/demo/",
    //         icons: [
    //           {
    //             src: "/assets/icon/guide-maskable.png",
    //             sizes: "192x192",
    //             purpose: "maskable",
    //             type: "image/png",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },
  },
});
