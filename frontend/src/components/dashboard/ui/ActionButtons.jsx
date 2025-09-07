import { Link } from "react-router-dom";
import style from "../../../app/Style"; 

const actions = [
  { name: "Add Blog", link: "/dashboard/blogs/new" },
  { name: "Create Writeup", link: "/dashboard/writeups/new" },
  { name: "Upload Podcast", link: "/dashboard/podcasts/new" },
  { name: "Add Event", link: "/dashboard/events/new" },
  { name: "Add Project", link: "/dashboard/projects/new" },
  { name: "Achievements", link: "/dashboard/achievements" },
];

export default function ActionButtons() {
  const s = style.actionButtons;

  return (
    <div className={s.wrapper}>
      <h2 className={s.title}>Quick Actions</h2>
      <div className={s.buttonContainer}>
        {actions.map(({ name, link }) => (
          <Link key={name} to={link} className={s.button}>
            {name}
          </Link>
        ))}
      </div>
    </div>
  );
}
