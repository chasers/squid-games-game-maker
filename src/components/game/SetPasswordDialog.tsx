
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface SetPasswordDialogProps {
  gameId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SetPasswordDialog = ({
  gameId,
  isOpen,
  onOpenChange,
}: SetPasswordDialogProps) => {
  const [joinPassword, setJoinPassword] = useState("");

  const handleUpdatePassword = async () => {
    if (!gameId) return;

    try {
      const { error } = await supabase
        .from('games')
        .update({ join_password: joinPassword })
        .eq('id', gameId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Game password updated successfully",
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: "Error",
        description: "Failed to update game password",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Join Password</DialogTitle>
          <DialogDescription>
            Set a password that players will need to join the game from the TV view.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input
              id="password"
              type="text"
              value={joinPassword}
              onChange={(e) => setJoinPassword(e.target.value)}
              className="col-span-3"
              placeholder="Enter join password"
            />
          </div>
        </div>
        <Button onClick={handleUpdatePassword}>
          Save Password
        </Button>
      </DialogContent>
    </Dialog>
  );
};
