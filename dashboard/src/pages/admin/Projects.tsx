import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProjectStore, Project } from "../../stores/AuthStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Header from "../../components/Header";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreVertical, Pencil, PlusCircle, Trash2 } from "lucide-react";

const Projects = () => {
  const [addImagePreview, setAddImagePreview] = useState<string | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const {
    projects,
    getProjects,
    createProject,
    updateProject,
    deleteProject,
    error,
  } = useProjectStore();

  const { onToggleSidebar } = useOutletContext<{
    onToggleSidebar: () => void;
  }>();

  // Zod schema for project
  const projectSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    technologies: z
      .array(z.string().min(1))
      .min(1, "At least one technology is required"),
    status: z.string().min(1, "Status is required"),
    githubLink: z.string().optional(),
    liveLink: z.string().optional(),
    image: z.union([z.instanceof(File), z.string(), z.null()]).optional(),
  });

  type ProjectForm = z.infer<typeof projectSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    mode: "onChange",
  });

  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  // State for dialog and editing
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (projectToEdit) {
      reset({
        title: projectToEdit.title,
        description: projectToEdit.description,
        technologies: projectToEdit.technologies,
        status: projectToEdit.status,
        githubLink: projectToEdit.githubLink || "",
        liveLink: projectToEdit.liveLink || "",
        image: projectToEdit.image || null,
      });
    } else {
      reset({
        title: "",
        description: "",
        technologies: [],
        status: "In Progress",
        githubLink: "",
        liveLink: "",
        image: null,
      });
    }
  }, [projectToEdit, reset]);

  const handleAddClick = async (data: ProjectForm) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    data.technologies.forEach((tech) =>
      formData.append("technologies[]", tech)
    );
    formData.append("githubLink", data.githubLink || "");
    formData.append("liveLink", data.liveLink || "");
    formData.append("status", data.status);
    if (data.image) formData.append("image", data.image as File);
    await createProject(formData);
    await getProjects(); // fetch latest projects
    setLoading(false);
    // clear the form
    reset({
      title: "",
      description: "",
      technologies: [],
      status: "In Progress",
      githubLink: "",
      liveLink: "",
      image: null,
    });
    setIsEditDialogOpen(false);
  };

  const handleUpdate = async (data: ProjectForm) => {
    if (!projectToEdit) return;
    setUpdating(true);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    data.technologies.forEach((tech) =>
      formData.append("technologies[]", tech)
    );
    formData.append("githubLink", data.githubLink || "");
    formData.append("liveLink", data.liveLink || "");
    formData.append("status", data.status);
    if (data.image) formData.append("image", data.image as File);
    await updateProject(projectToEdit._id, formData);
    await getProjects(); // fetch latest projects
    toast.success("Project updated successfully!");
    setIsEditDialogOpen(false);
    setProjectToEdit(null);
    setUpdating(false);
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <div className="sticky top-0 z-20">
        <Header title="Profile" onToggleSidebar={onToggleSidebar} />
      </div>
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 space-y-6">
        {/* create project */}
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold">Manage Projects</h2>
          {/* Create Project Dialog */}
          <Dialog
            open={isEditDialogOpen && projectToEdit === null}
            onOpenChange={(open) => {
              setIsEditDialogOpen(open);
              if (open) setProjectToEdit(null);
            }}
          >
            <DialogTrigger asChild>
              <Button
                className="bg-black hover:bg-gray-800 text-white"
                onClick={() => setProjectToEdit(null)}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Add New Project</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={handleSubmit(handleAddClick)}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" {...register("title")} />
                  {errors.title && (
                    <span className="text-red-500 text-xs">
                      {errors.title.message}
                    </span>
                  )}
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" {...register("description")} />
                  {errors.description && (
                    <span className="text-red-500 text-xs">
                      {errors.description.message}
                    </span>
                  )}
                </div>
                <div>
                  <Label htmlFor="technologies">
                    Technologies (comma-separated)
                  </Label>
                  <Input
                    id="technologies"
                    onChange={(e) => {
                      const arr = e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean);
                      setValue("technologies", arr, { shouldValidate: true });
                    }}
                  />
                  {errors.technologies && (
                    <span className="text-red-500 text-xs">
                      {errors.technologies.message}
                    </span>
                  )}
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    {...register("status")}
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Complete">Complete</option>
                  </select>
                  {errors.status && (
                    <span className="text-red-500 text-xs">
                      {errors.status.message}
                    </span>
                  )}
                </div>
                <div>
                  <Label htmlFor="githubLink">GitHub Link</Label>
                  <Input id="githubLink" {...register("githubLink")} />
                </div>
                <div>
                  <Label htmlFor="liveLink">Live Link</Label>
                  <Input id="liveLink" {...register("liveLink")} />
                </div>
                <div>
                  <Label htmlFor="image">Project Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setValue("image", file, { shouldValidate: true });
                      if (file) {
                        setAddImagePreview(URL.createObjectURL(file));
                      } else {
                        setAddImagePreview(null);
                      }
                    }}
                  />
                  {addImagePreview && (
                    <div className="mt-2 flex items-center gap-2">
                      <img
                        src={addImagePreview}
                        alt="Preview"
                        className="h-12 w-12 object-contain border"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setAddImagePreview(null);
                        }}
                      >
                        Cancel Image
                      </Button>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={loading} className="bg-black text-white hover:text-black">
                    {loading ? "Adding..." : "Add Project"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Projects Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-accent">
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Technologies</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project._id}>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>{project.status}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {project?.technologies?.map((tech) => (
                        <span
                          key={tech}
                          className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="bg-white text-gray-700 hover:bg-gray-100 dark:bg-white dark:hover:bg-gray-200"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setProjectToEdit(project);
                            setIsViewDialogOpen(true);
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setProjectToEdit(project);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="text-red-600 focus:text-red-700"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Confirm Deletion
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete the project "
                                {project.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteProject(project._id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Confirm Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* View Project */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>View Project</DialogTitle>
            </DialogHeader>

            {projectToEdit && (
              <div className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <p>{projectToEdit.title}</p>
                </div>
                <div>
                  <Label>Description</Label>
                  <p>{projectToEdit.description}</p>
                </div>
                <div>
                  <Label>Technologies</Label>
                  <div className="flex flex-wrap gap-2">
                    {projectToEdit.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Status</Label>
                  <p>{projectToEdit.status}</p>
                </div>
                {projectToEdit.githubLink && (
                  <div>
                    <Label>GitHub</Label>
                    <a
                      href={projectToEdit.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {projectToEdit.githubLink}
                    </a>
                  </div>
                )}
                {projectToEdit.liveLink && (
                  <div>
                    <Label>Live Link</Label>
                    <a
                      href={projectToEdit.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {projectToEdit.liveLink}
                    </a>
                  </div>
                )}
                {projectToEdit.image &&
                  typeof projectToEdit.image === "string" && (
                    <div>
                      <Label>Project Image</Label>
                      <img
                        src={projectToEdit.image}
                        alt="Project"
                        className="rounded-md mt-2 max-h-60"
                      />
                    </div>
                  )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Project Dialog */}
        <Dialog
          open={isEditDialogOpen && projectToEdit !== null}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) setProjectToEdit(null);
          }}
        >
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...register("title")} />
                {errors.title && (
                  <span className="text-red-500 text-xs">
                    {errors.title.message}
                  </span>
                )}
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...register("description")} />
                {errors.description && (
                  <span className="text-red-500 text-xs">
                    {errors.description.message}
                  </span>
                )}
              </div>
              <div>
                <Label htmlFor="technologies">
                  Technologies (comma-separated)
                </Label>
                <Input
                  id="technologies"
                  onChange={(e) => {
                    const arr = e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean);
                    setValue("technologies", arr, { shouldValidate: true });
                  }}
                />
                {errors.technologies && (
                  <span className="text-red-500 text-xs">
                    {errors.technologies.message}
                  </span>
                )}
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  {...register("status")}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Complete">Complete</option>
                </select>
                {errors.status && (
                  <span className="text-red-500 text-xs">
                    {errors.status.message}
                  </span>
                )}
              </div>
              <div>
                <Label htmlFor="githubLink">GitHub Link</Label>
                <Input id="githubLink" {...register("githubLink")} />
              </div>
              <div>
                <Label htmlFor="liveLink">Live Link</Label>
                <Input id="liveLink" {...register("liveLink")} />
              </div>
              <div>
                <Label htmlFor="image">Project Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setValue("image", file, { shouldValidate: true });
                    if (file) {
                      setEditImagePreview(URL.createObjectURL(file));
                    } else {
                      setEditImagePreview(null);
                    }
                  }}
                />
                {editImagePreview && (
                  <div className="mt-2 flex items-center gap-2">
                    <img
                      src={editImagePreview}
                      alt="Preview"
                      className="h-12 w-12 object-contain border"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditImagePreview(null);
                      }}
                    >
                      Cancel Image
                    </Button>
                  </div>
                )}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={updating}>
                  {updating ? "Updating..." : "Update Project"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Projects;
