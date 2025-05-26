"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import api from "@/lib/api";
import { useState } from "react";
import { LoadingButton } from "@/components/ui/loading-buuton";
import { CircleX } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

interface DeleteCriterionDialogProps {
  refresh?: () => void;
  criterion:{
    name:string,
    type:string,
    isGeneral:boolean,
    id:string
  }
}
export function DeleteCriterionDialog({ refresh ,criterion}: DeleteCriterionDialogProps) {
  const [isOpen, setIsOpen] = useState(false); // State to control dialog
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      setLoading(true);
      const response = await api.delete(`/criterias/${criterion.id}`);
      toast.success((response.data.message))
      if (refresh) refresh();

      setIsOpen(false);
    } catch (error) {
        if (axios.isAxiosError(error)) {
        toast.error((error.message))
      console.error("Deleting failed:", error);
        }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <CircleX className="text-destructive"/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Criterion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {criterion.name} !
          </DialogDescription>
        </DialogHeader>

          <form onSubmit={onSubmit} className="space-y-4">
            <DialogFooter>
              {loading ? (
                <LoadingButton disabled variant='destructive'>Deleting...</LoadingButton>
              ) : (
                <Button type="submit" className="bg-destructive" hidden={loading}>
                  Delete this criterion
                </Button>
              )}
            </DialogFooter>
          </form>
      </DialogContent>
    </Dialog>
  );
}
