import { useRouter } from "next/router";
import { useConfig } from "nextra-theme-docs";

export default {
  logo: <span>C3</span>,
  project: {
    link: "https://localhost:3000/profile",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="black"
      >
        <circle cx="12" cy="8" r="5" />
        <path d="M3,21 h18 C 21,12 3,12 3,21" />
      </svg>
    ),
  },
  useNextSeoProps() {
    const { asPath } = useRouter();
    if (asPath !== "/") {
      return {
        titleTemplate: "%s – C3",
      };
    }
  },
  head: () => {
    const { asPath, defaultLocale, locale } = useRouter();
    const { frontMatter } = useConfig();
    const url =
      "https://c3.cnmfu.local" +
      (defaultLocale === locale ? asPath : `/${locale}${asPath}`);

    return (
      <>
        <meta property="og:url" content={url} />
        <meta property="og:title" content={frontMatter.title || "Nextra"} />
        <meta
          property="og:description"
          content={frontMatter.description || "Cyber Crash Course"}
        />
      </>
    );
  },
  footer: {
    text: (
      <span>
        {new Date().getFullYear()} <a href="/">Cyber Crash Course</a>.
      </span>
    ),
  },
  editLink: {
    component: null,
  },
  feedback: {
    content: null,
  },
};
