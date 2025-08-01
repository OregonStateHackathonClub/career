// Holds the form and manages changes to the Profile for the student
"use client";

import { useRouter } from "next/navigation"
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bold } from "lucide-react";
import { uploadFile } from "@/lib/storage";

// for the image part
const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const imageUploadSchema = z.instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, `Max image size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`)
  .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), "Only .jpg, jpeg, .png and .webp formats are supported.");


const formSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  college: z.string().min(2).max(50),
  graduation: z.string().min(4).max(30),
  userid: z.string().min(2).max(10),
  skills: z.string().min(1),
  projects: z.array(
    z.object({ name: z.string().min(1), link: z.string().url() })
  ),
  website: z.string().url({ message: "A valid URL is required." }).optional(),
  resume: z
    .any()
      .refine((files) => 
        files && 
      files.length === 1 &&
        files[0]?.type === "application/pdf", {
          message: "Please upload a pdf",
      }),
  profilepicture: imageUploadSchema.optional(),
  
});
  
  type FormData = z.infer<typeof formSchema>;
  
  export function EditProfileForm( { onCancel }: { onCancel?: ()=> void }) {
    const {
      register,
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<FormData>({ resolver: zodResolver(formSchema), 
      defaultValues: { projects: [{ name: "", link: ""}]}, // we're starting with one empty project
    });
    // field array for the projects
    const {fields, append, remove } = useFieldArray({
      control,
      name: "projects",
    });
    
    const router = useRouter();

    const onSubmit = async (data: FormData) => {

      // Upload resume file
      let resumePath = "";
      if (data.resume && data.resume[0]) {
        resumePath = await uploadFile(data.resume[0]);
      }

      //transform the skills into an array
      const skillsArray = data.skills.split(",").map((skill) => skill.trim());
      const userProfile = {
        name: data.name,
        email: data.email,
        college: data.college,
        graduation: data.graduation,
        userid: data.userid,
        skills: skillsArray,
        projects: data.projects,
        // profilepicture: data.profilepicture
        resumePath, // this is the blob
      };

        // Send to your API route
      const res = await fetch(`/api/dashboard/${data.userid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userProfile),
      });

      const result = await res.json();
      if (res.ok) {
        // Save to localStorage and update state
        localStorage.setItem("userProfile", JSON.stringify(result));
        router.push("/dashboard");
        console.log("User profile data to submit:", userProfile);
        // You can now save this URL with the rest of the user data
      } else {
        alert(result.error || "Failed to save Profile");
      }
       

    };

  return (

    <>
      <h1 className="edit-profile-heading">Edit Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="edit-profile-form">
      
        <div className="form-group">
            <label>
              Name:
              <input type="text" {...register("name")} className="form-input"
              />
              {errors.name && <p className="form-error">{errors.name.message}</p>}
            </label>
        </div>
        <div className="form-group">
          <label>
            Email:
            <input type="text" {...register("email")} className="form-input"/>
            {errors.email && <p className="form-error">{errors.email.message}</p>}
          </label>
        </div>
        <br />
        <div className="form-group">
          <label>
            College:
            <input type="text" {...register("college")} className="form-input"/>
            {errors.college && <p className="form-error">{errors.college.message}</p>}
          </label>
        </div>
        <br />
        <div className="form-group">
          <label>
            Graduation (Spring 2027):
            <input type="text" {...register("graduation")} className="form-input" />
            {errors.graduation && <p className="form-error">{errors.graduation.message}</p>}
          </label>
        </div>
        <br />

        <div className="form-group">
          <label>
            ID (school id):
            <input type="text" {...register("userid")} className="form-input" />
            {errors.userid && <p className="form-error">{errors.userid.message}</p>}
          </label>
        </div>
        <br />
        
        <div className="form-group">
          <label>
            Skills (comma separated):
            <input type="text" {...register("skills")} className="form-input"/>
            {errors.skills && <p className="form-error">{errors.skills.message}</p>}
          </label>
        </div>
        <br />

        <div className="form-group">
          <label>
            Resume (PDF):
            <input type="file" accept="application/pdf" {...register("resume")} className="form-input"/>
            {errors.resume && typeof errors.resume.message === "string" && (
                 <p className="form-error">{errors.resume.message}</p> )}
          </label>
        </div>
        <br />

        {/* <div className="form-group">
          <label>
            Profile Picture:
            <input type="file" accept={ACCEPTED_IMAGE_TYPES.join(",")} {...register("profilepicture")} className="form-input" />
            {errors.profilepicture && typeof errors.profilepicture.message == "string" && (
              <p className="form-error">{errors.profilepicture.message}</p>
            )}
          </label>
        </div> */}

        <div className="form-group">
          <label>Projects:</label>
          {fields.map((field, index) => (
            <div key={field.id} className="project-fields">
              <input
                placeholder="Project Name"
                {...register(`projects.${index}.name` as const)}
                className="form-input"
              />
              <input
                placeholder="Project Link"
                {...register(`projects.${index}.link` as const)}
                className="form-input"
              />
              <button type="button" onClick={() => remove(index)} className="remove-btn">
                Remove
              </button>
              {errors.projects?.[index]?.name && (
                <p className="form-error">{errors.projects[index]?.name?.message}</p>
              )}
              {errors.projects?.[index]?.link && (
                <p className="form-error">{errors.projects[index]?.link?.message}</p>
              )}
          </div>
        ))}
        <button type="button" onClick={() => append({ name: "", link: "" })} className="add-btn">
          Add Project
        </button>
        </div>
        <div className="form-actions">
          <button type="submit" className="save-btn">Save</button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
          )}
        </div>
      </form>
    </>
      
  );
}
