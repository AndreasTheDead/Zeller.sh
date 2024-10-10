import { navbar } from "vuepress-theme-hope";

// https://theme-hope.vuejs.press/guide/layout/navbar.html

export const DefaultNavbar = navbar([
  "/",
  {
    text: "Articles",
    icon: "newspaper",
    prefix: "/category/",
    children: [
      { text: "Powershell", icon: "code", link: "powershell/" },
      { text: "Cloud", icon: "cloud", link: "cloud/" },
      { text: "Intune", icon: "laptop", link: "intune/" },
    ],
  }
]);
