"use client";

import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

// for the image part
const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const imageUploadSchema = z
  .any()
  .refine(
    (files) => files && files.length === 1 && files[0] instanceof File,
    "Input not instance of File"
  )
  .refine((files) => files && files[0]?.size <= MAX_FILE_SIZE,
    `Max image size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`)
  .refine((files) => files && ACCEPTED_IMAGE_TYPES.includes(files[0]?.type),
    "Only .jpg, jpeg, .png and .webp formats are supported."
  );

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

export function EditProfileForm({ onCancel, userId }: { onCancel?: () => void; userId?: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ 
    resolver: zodResolver(formSchema), 
    defaultValues: { projects: [{ name: "", link: ""}]}, // we're starting with one empty project
  });

  // field array for the projects
  const {fields, append, remove } = useFieldArray({
    control,
    name: "projects",
  });

  // Check if user exists and load their data
  useEffect(() => {
    const checkUserExists = async () => {
      if (userId) {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/dashboard/${userId}`);
          if (res.ok) {
            const userData = await res.json();
            setIsEditing(true);
            
            // Populate form with existing data
            setValue("name", userData.name || "");
            setValue("email", userData.email || "");
            setValue("college", userData.college || "");
            setValue("graduation", userData.graduation || "");
            setValue("userid", userData.userid || userId);
            setValue("skills", userData.skills?.join(", ") || "");
            setValue("projects", userData.projects || [{ name: "", link: "" }]);
            setValue("website", userData.website || "");
            
          } else if (res.status === 404) {
            // User doesn't exist, we'll create them
            setIsEditing(false);
            if (userId) {
              setValue("userid", userId);
            }
          }
        } catch (error) {
          console.error("Error checking user:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkUserExists();
  }, [userId, setValue]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    
    try {
      // upload profile picture
      let profilepicturePath = ""
      if (data.profilepicture && data.profilepicture[0]) {
        const formData = new FormData();
        formData.append("file", data.profilepicture[0]);
        const res = await fetch("/api/upload/profile-picture", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) {
          alert("Failed to upload profile picture");
          return;
        }
        const result = await res.json();
        profilepicturePath = result.publicUrl;
      }
      
      // Upload resume file
      let resumePath = ""
      if (data.resume && data.resume[0]) {
        const formData = new FormData();
        formData.append("file", data.resume[0]);
        const res = await fetch("/api/upload/resume", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) {
          alert("Failed to upload resume");
          return;
        }
        const result = await res.json();
        resumePath = result.fileName;
      }

      //skills into an array
      const skillsArray = data.skills.split(",").map((skill) => skill.trim());

      // Profile data
      const userProfile = {
        name: data.name,
        email: data.email,
        college: data.college,
        graduation: data.graduation,
        userid: data.userid,
        skills: skillsArray,
        projects: data.projects,
        profilepicturePath, // blob
        resumePath, // blob
        ...(data.website && { website: data.website }), // only include if provided
      };

      // Use PUT for updates, POST for creation
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch(`/api/dashboard/${data.userid}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userProfile),
      });

      const result = await res.json();
      if (res.ok) {
        // Save to localStorage and update state
        localStorage.setItem("userProfile", JSON.stringify(result));
        console.log(`${isEditing ? 'Updated' : 'Created'} user profile:`, result);
        console.log("Saved userId:", result.userid || result.id);
        
        // Show success message
        alert(`Profile ${isEditing ? 'updated' : 'created'} successfully!`);
        
        // Redirect to dashboard
        window.location.href = "/dashboard";
      } else {
        alert(result.error || `Failed to ${isEditing ? 'update' : 'create'} profile`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while saving the profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !userId) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1 className="edit-profile-heading text-white">
        {isEditing ? "Edit Profile" : "Create Profile"}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="edit-profile-form">
      
        <div className="form-group">
            <label>
              <strong> Name:</strong> 
              <input type="text" {...register("name")} className="form-input" />
              {errors.name && <p className="form-error">{errors.name.message}</p>}
            </label>
        </div>
        
        <div className="form-group">
          <label>
            <strong> Email:</strong> 
            <input type="text" {...register("email")} className="form-input"/>
            {errors.email && <p className="form-error">{errors.email.message}</p>}
          </label>
        </div>
        
        <div className="form-group">
          <label>
            <strong> College:</strong> 
            <input type="text" {...register("college")} className="form-input"/>
            {errors.college && <p className="form-error">{errors.college.message}</p>}
          </label>
        </div>
        
        <div className="form-group">
          <label>
            <strong> Graduation (Spring 2027):</strong> 
            <input type="text" {...register("graduation")} className="form-input" />
            {errors.graduation && <p className="form-error">{errors.graduation.message}</p>}
          </label>
        </div>

        <div className="form-group">
          <label>
            <strong> ID (school id):</strong>
            <input 
              type="text" 
              {...register("userid")} 
              className="form-input"
              readOnly={isEditing} // Don't allow changing ID when editing
            />
            {errors.userid && <p className="form-error">{errors.userid.message}</p>}
          </label>
        </div>
        
        <div className="form-group">
          <label>
            <strong> Skills (comma separated):</strong>
            <input type="text" {...register("skills")} className="form-input"/>
            {errors.skills && <p className="form-error">{errors.skills.message}</p>}
          </label>
        </div>

        <div className="form-group">
          <label>
            <strong> Website (optional):</strong>
            
            <input type="url" {...register("website")} className="form-input"/>
            {errors.website && <p className="form-error">{errors.website.message}</p>}
          </label>
        </div>

        <div className="form-group">
          <label>
            <strong> Resume (PDF): </strong>
            <input type="file" accept="application/pdf" {...register("resume")} className="form-input"/>
            {errors.resume && typeof errors.resume.message === "string" && (
                 <p className="form-error">{errors.resume.message}</p> )}
          </label>
        </div>

        <div className="form-group">
          <label>
            <strong> Profile Picture:</strong>
            <input type="file" accept={ACCEPTED_IMAGE_TYPES.join(",")} {...register("profilepicture")} className="form-input" />
            {errors.profilepicture && typeof errors.profilepicture.message == "string" && (
              <p className="form-error">{errors.profilepicture.message}</p>
            )}
          </label>
        </div>

        <div className="form-group">
          <label>
            <strong> Projects:</strong>
          </label>
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
          {onCancel && (
            <button type="button" onClick={onCancel} className="cancel-btn" disabled={isLoading}>
              Cancel
            </button>
          )}
          <button type="submit" className="save-btn" disabled={isLoading}>
            {isLoading ? "Saving..." : (isEditing ? "Update Profile" : "Create Profile")}
          </button>
        </div>
      </form>
    </>
  );
}