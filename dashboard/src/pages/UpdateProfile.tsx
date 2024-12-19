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
} from "../components/ui/alert-dialog";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

import { useState } from "react";

function UpdateProfile() {

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(file){
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Edit Account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update your account</AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                />
            </div>
            <div>
              <Label>New Password</Label>
              <Input
                type="password"
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                />
            </div>
            <div>
              <label>Image</label>
              <Input type="file" id="image" accept="image/*" onChange={handleImageChange} />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="mt-4 w-[200px] h-[200px]"
                />
              )}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction type="submit">
                {loading ? "..." : "Update"}
              </AlertDialogAction> 
            </AlertDialogFooter>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}


export default UpdateProfile