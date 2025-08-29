import React, { useState, useEffect } from "react";
import { Education, Experience } from "../../stores/UserStore";
import { useUserStore } from "../../stores/UserStore";
import { useAuthStore } from "../../stores/AuthStore";
import { Trash, Edit, UserCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { useOutletContext } from "react-router-dom";
import Header from "../../components/Header";

const ProfileSettings = () => {
  const { user } = useAuthStore();
  const { updateUser, deleteUser, changePassword, getUser } = useUserStore();

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState<File | string | null>(null);
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const { onToggleSidebar } = useOutletContext<{
    onToggleSidebar: () => void;
  }>();

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setTitle(user.title ?? "");
      setBio(user.bio ?? "");
      setImage(user.image ?? "");

      const mappedEducation = (user.education || []).map((edu: Education) => ({
        institution: edu.institution ?? "",
        degree: edu.degree ?? "",
        startYear: edu.startYear,
        endYear: edu.endYear,
        gpa: edu.gpa ?? "",
        uri: edu.uri,
      }));

      const mappedExperience = (user.experience || []).map(
        (exp: Experience) => ({
          company: exp.company ?? "",
          position: exp.position ?? "",
          startYear: exp.startYear,
          endYear: exp.endYear,
          uri: exp.uri,
        })
      );

      setEducation(mappedEducation);
      setExperience(mappedExperience);
    }
  }, [user, isEditDialogOpen]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    await updateUser(name, title, bio, education, experience, image as File);
    await getUser(); // fetch latest user data
    setIsEditDialogOpen(false);
    setImage(null);
    setIsUpdatingProfile(false);
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    try {
      setIsUpdatingPassword(true);
      await changePassword(currentPassword, newPassword);
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      console.error("Password update failed:", error);
      toast.error("Failed to update password.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleEducationChange = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
    const newEducation = [...education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setEducation(newEducation);
  };

  const handleExperienceChange = (
    index: number,
    field: keyof Experience,
    value: string
  ) => {
    const newExperience = [...experience];
    newExperience[index] = { ...newExperience[index], [field]: value };
    setExperience(newExperience);
  };

  const addEducationField = () => {
    setEducation([
      ...education,
      {
        institution: "",
        degree: "",
        startYear: new Date().getFullYear().toString(),
        endYear: new Date().getFullYear().toString(),
        gpa: "",
        uri: "",
      },
    ]);
  };

  const addExperienceField = () => {
    setExperience([
      ...experience,
      {
        company: "",
        position: "",
        startYear: new Date().getFullYear().toString(),
        endYear: new Date().getFullYear().toString(),
        uri: "",
      },
    ]);
  };

  const removeEducationField = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const removeExperienceField = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account?")) return;

    try {
      await deleteUser();
    } catch (error) {
      console.error("Failed to delete account:", error);
      toast.error("Failed to delete account");
    }
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <div className="sticky top-0 z-20">
        <Header title="Profile" onToggleSidebar={onToggleSidebar} />
      </div>
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 space-y-6">
        {/* Edit Profile Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black hover:bg-gray-800 text-white">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto flex flex-col bg-white">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="image">Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setImage(file);
                  }}
                />
                {image && typeof image !== "string" && (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="w-20 h-20 rounded-full mt-2"
                  />
                )}
              </div>

              {/* Education Section */}
              <div className="space-y-2">
                <Label>Education</Label>
                {education.map((edu, index) => (
                  <div
                    key={index}
                    className="border p-3 rounded-md space-y-2 relative bg-gray-100"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Institution"
                        value={edu.institution}
                        onChange={(e) =>
                          handleEducationChange(
                            index,
                            "institution",
                            e.target.value
                          )
                        }
                      />
                      <Input
                        placeholder="Degree"
                        value={edu.degree}
                        onChange={(e) =>
                          handleEducationChange(index, "degree", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Start Year"
                        type="text"
                        value={edu.startYear}
                        onChange={(e) =>
                          handleEducationChange(
                            index,
                            "startYear",
                            e.target.value
                          )
                        }
                      />
                      <Input
                        placeholder="End Year"
                        type="text"
                        value={edu.endYear}
                        onChange={(e) =>
                          handleEducationChange(
                            index,
                            "endYear",
                            e.target.value
                          )
                        }
                      />
                      <Input
                        placeholder="GPA"
                        type="text"
                        value={edu.gpa}
                        onChange={(e) =>
                          handleEducationChange(index, "gpa", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Institution Website URL"
                        type="text"
                        value={edu.uri}
                        onChange={(e) =>
                          handleEducationChange(index, "uri", e.target.value)
                        }
                      />
                    </div>
                    <Button
                      variant="destructive"
                      type="button"
                      size="sm"
                      className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full"
                      onClick={() => removeEducationField(index)}
                    >
                      <X />
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={addEducationField}>
                  Add Education
                </Button>
              </div>

              {/* Experience Section */}
              <div className="space-y-2">
                <Label>Experience</Label>
                {experience.map((exp, index) => (
                  <div
                    key={index}
                    className="border p-3 rounded-md space-y-2 relative bg-gray-100"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Company"
                        value={exp.company}
                        onChange={(e) =>
                          handleExperienceChange(
                            index,
                            "company",
                            e.target.value
                          )
                        }
                      />
                      <Input
                        placeholder="Position"
                        value={exp.position}
                        onChange={(e) =>
                          handleExperienceChange(
                            index,
                            "position",
                            e.target.value
                          )
                        }
                      />
                      <Input
                        placeholder="Start Year"
                        type="text"
                        value={exp.startYear}
                        onChange={(e) =>
                          handleExperienceChange(
                            index,
                            "startYear",
                            e.target.value
                          )
                        }
                      />
                      <Input
                        placeholder="End Year"
                        type="text"
                        value={exp.endYear}
                        onChange={(e) =>
                          handleExperienceChange(
                            index,
                            "endYear",
                            e.target.value
                          )
                        }
                      />
                      <Input
                        placeholder="Company Website URL"
                        type="text"
                        value={exp.uri}
                        onChange={(e) =>
                          handleExperienceChange(index, "uri", e.target.value)
                        }
                      />
                    </div>
                    <Button
                      variant="destructive"
                      type="button"
                      size="sm"
                      className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full"
                      onClick={() => removeExperienceField(index)}
                    >
                      <X />
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={addExperienceField}>
                  Add Experience
                </Button>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  {isUpdatingProfile ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Profile details */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mt-8">
          <h2 className="text-lg font-bold mb-4">Profile Details</h2>
          <div className="flex flex-col items-center mb-6">
            {user?.image ? (
              <img
                src={user?.image || "/default-avatar.png"}
                alt="Profile"
                className="w-24 h-24 rounded-full mb-4"
              />
            ) : (
              <UserCircle className="w-24 h-24 text-gray-400 mb-4" />
            )}
          </div>

          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold">{user?.name}</h3>
            <p className="text-gray-600 dark:text-gray-300">{user?.title}</p>
          </div>

          <div className="text-center">
            <p className="text-gray-700 dark:text-gray-300">{user?.bio}</p>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mt-6 mb-4">Education</h3>
            {user?.education && user.education.length > 0 ? (
              user.education.map((edu, index) => (
                <div key={index} className="mb-2">
                  <p className="font-semibold">{edu.institution}</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {edu.degree} ({edu.startYear} - {edu.endYear})
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    GPA: {edu.gpa}
                  </p>
                  <a
                    href={edu.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View the institution website
                  </a>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No education details available.</p>
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mt-6 mb-4">Experience</h3>
            {user?.experience && user.experience.length > 0 ? (
              user.experience.map((exp, index) => (
                <div key={index} className="mb-2">
                  <p className="font-semibold">{exp.company}</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {exp.position} ({exp.startYear} - {exp.endYear})
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No experience details available.</p>
            )}
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mt-8">
          <h3 className="text-xl font-semibold mb-4">Change Password</h3>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              disabled={isUpdatingPassword}
              className="bg-black hover:bg-gray-800 text-white"
            >
              {isUpdatingPassword ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </div>

        {/* Delete Account */}
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 shadow-lg rounded-lg p-6 mt-8">
          <h3 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-4">
            Danger Zone
          </h3>
          <p className="text-red-600 dark:text-red-300 mb-4">
            Deleting your account is a permanent action and cannot be undone.
          </p>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will permanently delete your account and remove
                  all of your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Yes, delete it
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </main>
    </div>
  );
};

export default ProfileSettings;
