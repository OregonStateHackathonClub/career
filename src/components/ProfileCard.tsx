import React from "react";
import Image from "next/image";

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
  profilepictureUrl?: string;
  website?: string;
};

function ProfileCard(props: ProfileCardProps) {
  console.log(props.profilepictureUrl)
  return (
    <div className="card">
      <div className="image-fields-container"> 
         <div> 
          {props.profilepictureUrl ? (
            <Image 
            className="size-30 rounded-full"
            src={props.profilepictureUrl || ""}
            alt={`${props.name}'s profile`}
            width={120}
            height={120}
          />
          ) : null }
          
        </div>

        <div className="card-img-left"> 
          <h2 className="beaver-name">{props.name}</h2><br />
          <p className="card-group">
            <strong> Email: </strong> {props.email}
          </p>

          <p className="card-group">
            <strong> College: </strong> {props.college} - {props.graduation} 
          </p>
        </div>

      </div>

      <p className="card-group">
        <strong>Skills: </strong> {props.skills.join(", ")}</p>

      <p className="card-group">
        <strong>Resume:{" "}</strong>
        {props.resumeUrl ? (
          <>
             {/* Display a friendly file name and link to the preview section */}
            <a
              href={`#resume-preview`}                // <-- jump to the preview below
              className="resume-inline-link"
              title="View resume preview below"
            >
              {decodeURIComponent(props.resumeUrl).replace(/^[0-9]+-/, "")}
            </a>

            {/* Optional: external download too */}
            <span className="resume-sep"> · </span>
            <a
              href={`/api/resume-download/${encodeURIComponent(props.resumeUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="resume-inline-link"
            >
              Download
            </a>
          </>
        ) : (
          "No resume uploaded"
        )}
      </p>

      <p className="card-group">
        <strong>Website: {" "}</strong>
        <a
          href={`https://${props.website}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {props.website}
        </a>
      </p >
      
      <div className="card-group">
        <strong>Projects: </strong>
        <ul>
          {props.projects.map((project, idx) => (
            <li key={idx} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <span> { project.name }</span>
              <a href={project.link} target="_blank" rel="noopener noreferrer">
                {project.link}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ProfileCard;
