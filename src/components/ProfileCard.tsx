import React from "react";

type Project = {
  name: string;
  link: string;
};

export type ProfileCardProps = {
  name: string;
  email: string;
  college: string;
  graduation: string;
  userid: string;
  skills: string[];
  projects: Project[];
  resumeUrl: string;
  website?: string;
};

function ProfileCard(props: ProfileCardProps) {
  return (
    <div className= "card">
      <h2>{props.name}</h2>
      <p> email: {props.email} </p>

      <p>
        College: {props.college} - {props.graduation}
      </p>
      
      <p>Skills: {props.skills.join(", ")}</p>

      <a href={props.resumeUrl} target="_blank" rel="noopener noreferrer">
        {props.resumeUrl.split("/").pop() || "Download"}
      </a>
      <p>
        Resume:{" "}
        <a href={props.resumeUrl} target="_blank" rel="noopener noreferrer">
          Download
        </a>
      </p>

      <p>
        Website:{" "}
        <a
          href={`https://${props.website}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {props.website}
        </a>
      </p>
      <div>
        <h3>Projects:</h3>
        <ul>
          {props.projects.map((project, idx) => (
            <li key={idx}>
              <a href={project.link} target="_blank" rel="noopener noreferrer">
                {project.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ProfileCard;
