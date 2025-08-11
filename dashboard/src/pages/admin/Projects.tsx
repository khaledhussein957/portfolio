import { useEffect, useState } from "react";
import { useProjectStore, Project } from "../../stores/ProjectStore";
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

  // State for the form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [status, setStatus] = useState("In Progress");
  const [githubLink, setGithubLink] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [image, setImage] = useState<File | string | null>(null);

  const [loading, setLoading] = useState(false);

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
      setTitle(projectToEdit.title);
      setDescription(projectToEdit.description);
      setTechnologies(projectToEdit.technologies);
      setStatus(projectToEdit.status);
      setGithubLink(projectToEdit.githubLink || "");
      setLiveLink(projectToEdit.liveLink || "");
      setImage(projectToEdit.image || null);
    } else {
      // Reset form when adding a new project
      setTitle("");
      setDescription("");
      setTechnologies([]);
      setStatus("In Progress");
      setGithubLink("");
      setLiveLink("");
      setImage(null);
    }
  }, [projectToEdit]);

  const handleAddClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !technologies.length || !status) {
      toast.error("Both skill and proficiency are required.");
      return;
    }
    await createProject(
      title,
      description,
      technologies,
      githubLink,
      status,
      image as File
    );
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectToEdit) return;
    await updateProject(
      projectToEdit._id,
      title,
      description,
      technologies,
      githubLink,
      status,
      image as File
    );
    toast.success("Project updated successfully!");
    setIsEditDialogOpen(false);
    setProjectToEdit(null);
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Projects" onToggleSidebar={onToggleSidebar} />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 space-y-6">
        {/* create project */}
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold">Manage Projects</h2>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-black">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Project</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddClick} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="technologies">
                    Technologies (comma-separated)
                  </Label>
                  <Input
                    id="technologies"
                    value={technologies.join(", ")}
                    onChange={(e) =>
                      setTechnologies(
                        e.target.value.split(",").map((t) => t.trim())
                      )
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Input
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="githubLink">GitHub Link</Label>
                  <Input
                    id="githubLink"
                    value={githubLink}
                    onChange={(e) => setGithubLink(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="liveLink">Live Link</Label>
                  <Input
                    id="liveLink"
                    value={liveLink}
                    onChange={(e) => setLiveLink(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="image">Project Image</Label>
                  <Input
                    id="image"
                    type="file"
                    onChange={(e) =>
                      setImage(e.target.files ? e.target.files[0] : null)
                    }
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit">
                    {loading ? "adding..." : "Add Project"}
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
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Confirm Deletion
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete the project \"
                                {project.title}\"? This action cannot be undone.
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
          <DialogContent>
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

        {/* Edit Skill Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="technologies">
                  Technologies (comma-separated)
                </Label>
                <Input
                  id="technologies"
                  value={technologies.join(", ")}
                  onChange={(e) =>
                    setTechnologies(
                      e.target.value.split(",").map((t) => t.trim())
                    )
                  }
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Input
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="githubLink">GitHub Link</Label>
                <Input
                  id="githubLink"
                  value={githubLink}
                  onChange={(e) => setGithubLink(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="liveLink">Live Link</Label>
                <Input
                  id="liveLink"
                  value={liveLink}
                  onChange={(e) => setLiveLink(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="image">Project Image</Label>
                <Input
                  id="image"
                  type="file"
                  onChange={(e) =>
                    setImage(e.target.files ? e.target.files[0] : null)
                  }
                />
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Update Project</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Projects;
