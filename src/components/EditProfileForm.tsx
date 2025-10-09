// Edit Profile form

"use client";

import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

// for the image part
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const imageUploadSchema = z
  .any()
  .refine(
    (files) => files && files.length === 1 && files[0] instanceof File,
    "Input not instance of File",
  )
  .refine(
    (files) => files && files[0]?.size <= MAX_FILE_SIZE,
    `Max image size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
  )
  .refine(
    (files) => files && ACCEPTED_IMAGE_TYPES.includes(files[0]?.type),
    "Only .jpg, jpeg, .png and .webp formats are supported.",
  );

const formSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  college: z.string().min(2).max(50),
  graduation: z.string().min(4).max(30),
  userid: z.string().min(2).max(10),
  skills: z.string().min(1),
  projects: z.array(
    z.object({ name: z.string().min(1), link: z.string().url() }),
  ),
  website: z.string().url({ message: "A valid URL is required." }).optional(),
  resume: z
    .any()
    .refine(
      (files) =>
        files && files.length === 1 && files[0]?.type === "application/pdf",
      {
        message: "Please upload a pdf",
      },
    ),
  profilepicture: imageUploadSchema.optional(),
});

type FormData = z.infer<typeof formSchema>;

export function EditProfileForm({
  onCancel,
  userId,
}: {
  onCancel?: () => void;
  userId?: string;
}) {
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
    defaultValues: { projects: [{ name: "", link: "" }] }, // we're starting with one empty project
  });

  // field array for the projects
  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects",
  });

  // Check if user exists and load their data
  useEffect(() => {
    const checkUserExists = async () => {
      if (userId) {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/user/${userId}`);
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
      let profilepicturePath = "";
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
        profilepicturePath = result.fileName;
      }

      // Upload resume file
      let resumePath = "";
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
      const res = await fetch(`/api/user/${data.userid}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userProfile),
      });

      const result = await res.json();
      if (res.ok) {
        // Save to localStorage and update state
        localStorage.setItem("userProfile", JSON.stringify(result));
        console.log(
          `${isEditing ? "Updated" : "Created"} user profile:`,
          result,
        );
        console.log("Saved userId:", result.userid || result.id);

        // Show success message
        alert(`Profile ${isEditing ? "updated" : "created"} successfully!`);

        // Redirect to dashboard
        window.location.href = "/dashboard";
      } else {
        alert(
          result.error ||
            `Failed to ${isEditing ? "update" : "create"} profile`,
        );
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
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-neutral-200 to-neutral-400 bg-clip-text text-transparent mb-2">
            {isEditing ? "Edit Profile" : "Create Profile"}
          </h1>
          <p className="text-neutral-500 text-lg">
            {isEditing
              ? "Update your information below"
              : "Tell us about yourself"}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-neutral-950/80 backdrop-blur-sm border border-neutral-800 rounded-2xl p-8 shadow-2xl shadow-black/40 space-y-8">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-neutral-300 border-b border-neutral-700 pb-3">
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-neutral-400">
                    Name
                  </label>
                  <input
                    type="text"
                    {...register("name")}
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:border-neutral-600 transition-all duration-200 hover:border-neutral-600"
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-neutral-400">
                    Email
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:border-neutral-600 transition-all duration-200 hover:border-neutral-600"
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-neutral-400">
                    College
                  </label>
                  <input
                    type="text"
                    {...register("college")}
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:border-neutral-600 transition-all duration-200 hover:border-neutral-600"
                    placeholder="Your university or college"
                  />
                  {errors.college && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.college.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-neutral-400">
                    Graduation
                  </label>
                  <input
                    type="text"
                    {...register("graduation")}
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:border-neutral-600 transition-all duration-200 hover:border-neutral-600"
                    placeholder="Spring 2027"
                  />
                  {errors.graduation && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.graduation.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-neutral-400">
                    Student ID
                  </label>
                  <input
                    type="text"
                    {...register("userid")}
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:border-neutral-600 transition-all duration-200 hover:border-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-950"
                    placeholder="Your school ID"
                    readOnly={isEditing}
                  />
                  {errors.userid && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.userid.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-neutral-400">
                    Website{" "}
                    <span className="text-neutral-600 font-normal">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="url"
                    {...register("website")}
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:border-neutral-600 transition-all duration-200 hover:border-neutral-600"
                    placeholder="https://your-website.com"
                  />
                  {errors.website && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.website.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-neutral-400">
                  Skills
                </label>
                <input
                  type="text"
                  {...register("skills")}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:border-neutral-600 transition-all duration-200 hover:border-neutral-600"
                  placeholder="JavaScript, React, Node.js, Python (comma separated)"
                />
                {errors.skills && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.skills.message}
                  </p>
                )}
              </div>
            </div>

            {/* File Uploads Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-neutral-300 border-b border-neutral-700 pb-3">
                Documents
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-neutral-400">
                    Resume (PDF)
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    {...register("resume")}
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-neutral-700 file:text-white file:font-medium hover:file:bg-neutral-600 transition-all duration-200 hover:border-neutral-600"
                  />
                  {errors.resume &&
                    typeof errors.resume.message === "string" && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.resume.message}
                      </p>
                    )}
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-neutral-400">
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    accept={ACCEPTED_IMAGE_TYPES.join(",")}
                    {...register("profilepicture")}
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-neutral-700 file:text-white file:font-medium hover:file:bg-neutral-600 transition-all duration-200 hover:border-neutral-600"
                  />
                  {errors.profilepicture &&
                    typeof errors.profilepicture.message === "string" && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.profilepicture.message}
                      </p>
                    )}
                </div>
              </div>
            </div>

            {/* Projects Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-neutral-300">
                  Projects
                </h2>
                <button
                  type="button"
                  onClick={() => append({ name: "", link: "" })}
                  className="px-6 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg transform hover:scale-105"
                >
                  Add Project
                </button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="bg-neutral-900/50 border border-neutral-700 rounded-xl p-6 space-y-4 hover:bg-neutral-900/70 transition-colors duration-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <input
                          placeholder="Project Name"
                          {...register(`projects.${index}.name` as const)}
                          className="w-full px-4 py-3 bg-neutral-800 border border-neutral-600 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 transition-all duration-200 hover:border-neutral-500"
                        />
                        {errors.projects?.[index]?.name && (
                          <p className="text-red-400 text-sm">
                            {errors.projects[index]?.name?.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <input
                          placeholder="Project Link"
                          {...register(`projects.${index}.link` as const)}
                          className="w-full px-4 py-3 bg-neutral-800 border border-neutral-600 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 transition-all duration-200 hover:border-neutral-500"
                        />
                        {errors.projects?.[index]?.link && (
                          <p className="text-red-400 text-sm">
                            {errors.projects[index]?.link?.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25"
                    >
                      Remove Project
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-neutral-700">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-8 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-neutral-600 hover:border-neutral-500"
                  disabled={isLoading}
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-8 py-3 bg-neutral-700 hover:bg-neutral-600 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none shadow-lg transform hover:scale-105"
                disabled={isLoading}
              >
                {isLoading
                  ? "Saving..."
                  : isEditing
                    ? "Update Profile"
                    : "Create Profile"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
