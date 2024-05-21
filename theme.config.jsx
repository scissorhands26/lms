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
