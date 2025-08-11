import { useEffect, useState } from "react";
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
  const { skills, getSkills, deleteSkill, addSkill, updateSkill, error } =
    useSkillStore();
  const { onToggleSidebar } = useOutletContext<{
    onToggleSidebar: () => void;
  }>();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [skillToEdit, setSkillToEdit] = useState<Skill | null>(null);

  const [skill, setSkill] = useState("");
  const [proficiency, setProficiency] = useState("");

  useEffect(() => {
    getSkills();
  }, [getSkills]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (skillToEdit) {
      setSkill(skillToEdit.skill);
      setProficiency(skillToEdit.proficiency);
    } else {
      setSkill("");
      setProficiency("");
    }
  }, [skillToEdit]);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skill || !proficiency) {
      toast.error("Both skill and proficiency are required.");
      return;
    }
    await addSkill(skill, proficiency);
    setIsAddDialogOpen(false);
    setSkill("");
    setProficiency("");
  };

  const handleUpdateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillToEdit) return;
    await updateSkill(skillToEdit._id, { skill, proficiency });
    setIsEditDialogOpen(false);
    setSkillToEdit(null);
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Skills" onToggleSidebar={onToggleSidebar} />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 space-y-6">

        {/* create skill */}
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold">Manage Projects</h2>
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
              <form onSubmit={handleAddSkill} className="space-y-4">
                <div>
                  <Label htmlFor="name">Skill Name</Label>
                  <Input
                    id="name"
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="proficiency">Proficiency</Label>
                  <Input
                    id="proficiency"
                    value={proficiency}
                    onChange={(e) => setProficiency(e.target.value)}
                    placeholder="e.g., Expert, Intermediate, Beginner"
                    required
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit">Create Skill</Button>
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
                <TableHead>Name</TableHead>
                <TableHead>Proficiency</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skills.map((skill) => (
                <TableRow key={skill._id}>
                  <TableCell className="font-medium">{skill.skill}</TableCell>
                  <TableCell>{skill.proficiency}</TableCell>
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
            <form onSubmit={handleUpdateSkill} className="space-y-4">
              <div>
                <Label htmlFor="editName">Skill Name</Label>
                <Input
                  id="editName"
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="editProficiency">Proficiency</Label>
                <Input
                  id="editProficiency"
                  value={proficiency}
                  onChange={(e) => setProficiency(e.target.value)}
                  placeholder="e.g., Expert, Intermediate, Beginner"
                  required
                />
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
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Skills;
