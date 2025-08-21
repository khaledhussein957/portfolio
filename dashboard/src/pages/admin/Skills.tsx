import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSkillStore, Skill } from "../../stores/SkillStore";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { useOutletContext } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2, Plus } from "lucide-react";
import toast from "react-hot-toast";

const Skills = () => {
  const { skills, getSkills, deleteSkill, addSkill, updateSkill, error, isLoading } =
    useSkillStore();
  const { onToggleSidebar } = useOutletContext<{
    onToggleSidebar: () => void;
  }>();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [skillToEdit, setSkillToEdit] = useState<Skill | null>(null);
  const [addIconPreview, setAddIconPreview] = useState<string | null>(null);
  const [editIconPreview, setEditIconPreview] = useState<string | null>(null);

  // Zod schema for skill
  const addSkillSchema = z.object({
    skill: z.array(z.string().min(1, "Skill name is required")).min(1, "At least one skill is required"),
    groupName: z.string().min(1, "Group name is required"),
    icon: z.instanceof(File).refine((file) => file.size > 0, "Icon is required")
  });

  const editSkillSchema = z.object({
    skill: z.array(z.string().min(1, "Skill name is required")).min(1, "At least one skill is required"),
    groupName: z.string().min(1, "Group name is required"),
    icon: z.union([z.instanceof(File), z.undefined(), z.null()])
  });

  type AddSkillForm = z.infer<typeof addSkillSchema>;
  type EditSkillForm = z.infer<typeof editSkillSchema>;

  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    reset: resetAdd,
    setValue: setValueAdd,
    formState: { errors: errorsAdd }
  } = useForm<AddSkillForm>({
    resolver: zodResolver(addSkillSchema),
    mode: "onChange"
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    setValue: setValueEdit,
    formState: { errors: errorsEdit }
  } = useForm<EditSkillForm>({
    resolver: zodResolver(editSkillSchema),
    mode: "onChange"
  });

  useEffect(() => {
    getSkills();
  }, [getSkills]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (skillToEdit) {
      resetEdit({
        skill: Array.isArray(skillToEdit.skill) ? skillToEdit.skill : [skillToEdit.skill],
        groupName: skillToEdit.groupName,
        icon: undefined as unknown as File // icon not prefilled
      });
    } else {
      resetEdit();
    }
  }, [skillToEdit, resetEdit]);

  const handleAddSkill = async (data: AddSkillForm) => {
    await addSkill(data);
    setIsAddDialogOpen(false);
    resetAdd();
  };

  const handleUpdateSkill = async (data: EditSkillForm) => {
    if (!skillToEdit) return;
    await updateSkill(skillToEdit._id, data);
    setIsEditDialogOpen(false);
    setSkillToEdit(null);
    resetEdit();
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <div className="sticky top-0 z-20">
        <Header title="Profile" onToggleSidebar={onToggleSidebar} />
      </div>
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 space-y-6">

        {/* create skill */}
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold">Manage Skills</h2>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-black">
                <Plus className="mr-2 h-4 w-4" />
                New Skill
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Skill</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmitAdd(handleAddSkill)} className="space-y-4">
                <div>
                  <Label htmlFor="skills">Skills (comma separated)</Label>
                  <Input
                    id="skills"
                    onChange={e => {
                      const value = e.target.value;
                      const arr = value.split(",").map(s => s.trim()).filter(Boolean);
                      setValueAdd("skill", arr, { shouldValidate: true });
                    }}
                  />
                  {errorsAdd.skill && (
                    <span className="text-red-500 text-xs">{errorsAdd.skill.message}</span>
                  )}
                </div>
                <div>
                  <Label htmlFor="groupName">Group Name</Label>
                  <Input
                    id="groupName"
                    {...registerAdd("groupName")}
                  />
                  {errorsAdd.groupName && (
                    <span className="text-red-500 text-xs">{errorsAdd.groupName.message}</span>
                  )}
                </div>
                <div>
                  <Label htmlFor="icon">Icon</Label>
                  <Input
                    id="icon"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files && e.target.files[0];
                      setValueAdd("icon", file as File, { shouldValidate: true });
                      if (file) {
                        setAddIconPreview(URL.createObjectURL(file));
                      } else {
                        setAddIconPreview(null);
                      }
                    }}
                  />
                  {addIconPreview && (
                    <div className="mt-2 flex items-center gap-2">
                      <img src={addIconPreview} alt="Preview" className="h-12 w-12 object-contain border" />
                      <Button type="button" variant="outline" size="sm" onClick={() => {
                        setAddIconPreview(null);
                        setValueAdd("icon", undefined);
                      }}>Cancel Icon</Button>
                    </div>
                  )}
                  {errorsAdd.icon && (
                    <span className="text-red-500 text-xs">{errorsAdd.icon.message}</span>
                  )}
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Loading..." : "Create Skill"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Skills Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-accent">
              <TableRow>
                <TableHead>Icon</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Group</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skills.map((skill) => (
                <TableRow key={skill._id}>
                  <TableCell>
                    {skill.icon && (
                      <img src={skill.icon} alt={skill.groupName} className="h-8 w-8 object-contain" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(skill.skill)
                        ? skill.skill.map((s, idx) => (
                            <span key={idx} className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs border">
                              {s}
                            </span>
                          ))
                        : (
                            <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs border">{skill.skill}</span>
                          )}
                    </div>
                  </TableCell>
                  <TableCell>{skill.groupName}</TableCell>
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
                          className="cursor-pointer"
                          onClick={() => {
                            setSkillToEdit(skill);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="cursor-pointer text-red-600"
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
                                Are you sure you want to delete the skill \"
                                {skill.skill}\"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteSkill(skill._id)}
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

        {/* Edit Skill Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Skill</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitEdit(handleUpdateSkill)} className="space-y-4">
              <div>
                <Label htmlFor="editSkills">Skills (comma separated)</Label>
                <Input
                  id="editSkills"
                  defaultValue={skillToEdit?.skill ? (Array.isArray(skillToEdit.skill) ? skillToEdit.skill.join(", ") : skillToEdit.skill) : ""}
                  onChange={e => {
                    const value = e.target.value;
                    const arr = value.split(",").map(s => s.trim()).filter(Boolean);
                    setValueEdit("skill", arr, { shouldValidate: true });
                  }}
                />
                {errorsEdit.skill && (
                  <span className="text-red-500 text-xs">{errorsEdit.skill.message}</span>
                )}
              </div>
              <div>
                <Label htmlFor="editGroupName">Group Name</Label>
                <Input
                  id="editGroupName"
                  {...registerEdit("groupName")}
                />
                {errorsEdit.groupName && (
                  <span className="text-red-500 text-xs">{errorsEdit.groupName.message}</span>
                )}
              </div>
              <div>
                <Label htmlFor="editIcon">Icon</Label>
                <Input
                  id="editIcon"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    setValueEdit("icon", file as File, { shouldValidate: true });
                    if (file) {
                      setEditIconPreview(URL.createObjectURL(file));
                    } else {
                      setEditIconPreview(null);
                    }
                  }}
                />
                {editIconPreview && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={editIconPreview} alt="Preview" className="h-12 w-12 object-contain border" />
                    <Button type="button" variant="outline" size="sm" onClick={() => {
                      setEditIconPreview(null);
                      setValueEdit("icon", undefined);
                    }}>Cancel Icon</Button>
                  </div>
                )}
                {!editIconPreview && skillToEdit?.icon && (
                  <img src={skillToEdit.icon} alt={Array.isArray(skillToEdit.skill) ? skillToEdit.skill.join(", ") : skillToEdit.skill} className="h-8 w-8 object-contain mt-2" />
                )}
                {errorsEdit.icon && (
                  <span className="text-red-500 text-xs">{errorsEdit.icon.message}</span>
                )}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setSkillToEdit(null)}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Loading..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Skills;
