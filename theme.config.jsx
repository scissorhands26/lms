export default {
  logo: <span>C3</span>,
  project: {
    link: "/profile",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="black"
      >
        <circle cx="12" cy="8" r="5" />
        <path d="M3,21 h18 C 21,12 3,12 3,21" />
      </svg>
    ),
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
