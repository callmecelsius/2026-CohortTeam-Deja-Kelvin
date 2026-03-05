import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { insertBehaviorLog } from "@/api/mypets";
import { toast, Toaster } from "sonner";


type FosterUser = {
    id: number;
    firstName: string;
    lastName: string;
};

type BehaviorModalProps = {
    animalId: number;             // the pet ID
    fosterUsers: FosterUser[];    // current user ID
    onAdd: (behavior: {
        AnimalId: number;
        ReportedByUserId: number;
        BehaviorType: string;
        Notes: string;
        DateReported: string;
        Resolved: boolean;
    }) => void;
};

const BehaviorModal: React.FC<BehaviorModalProps> = ({ animalId,
    fosterUsers,
    onAdd, }) => {
    const [open, setOpen] = useState(false);
    const [behaviorType, setBehaviorType] = useState("");
    const [notes, setNotes] = useState("");
    const [resolved, setResolved] = useState(false);
    const [reportedByUserId, setReportedByUserId] = useState<number | null>(null);

    const handleAdd = async () => {
        if (!reportedByUserId) {
            toast.success("Please select a user");
            return;
        }

        const newBehavior = {                       
            AnimalId: animalId,           
            ReportedByUserId: reportedByUserId,
            BehaviorType: behaviorType,
            Notes: notes,
            DateReported: new Date(),
            Resolved: resolved,
        };

        try {
            // Call your API
            const savedBehavior = await insertBehaviorLog(newBehavior);

            // Notify parent
            onAdd(savedBehavior);
            toast.success("Behavior Inserted successfully");
            window.location.reload();

            // reset fields
            setBehaviorType("");
            setNotes("");
            setResolved(false);
            setReportedByUserId(null);
            setOpen(false);
        } catch (error) {
            toast.error("Failed to save behavior. Check console for details.");
        }
    };
    return (
        
        <Dialog open={open} onOpenChange={setOpen}>
            <Toaster richColors position="top-center" />
            <DialogTrigger asChild>
                <Button className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-100 hover:bg-purple-200 dark:bg-purple-900 dark:hover:bg-purple-800 transition" onClick={() => setOpen(true)}>
                    <Plus className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add Behavior</DialogTitle>
                    <DialogDescription>
                        Add behavior details for this animal.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <Label htmlFor="reported-byUserId">User</Label>
                    <Select onValueChange={(value) => setReportedByUserId(Number(value))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Foster Parent" />
                        </SelectTrigger>
                        <SelectContent>
                            {fosterUsers.map((user) => (
                                <SelectItem key={user.id} value={user.id.toString()}>
                                    {user.firstName} {user.lastName}
                                    {/* (ID: {user.id}) */}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    
                    <div className="space-y-2">
                    <Label htmlFor="behavior-type">Behavior Type</Label>
                    <Textarea
                        placeholder="Behavior type"
                        value={behaviorType}
                        onChange={(e) => setBehaviorType(e.target.value)}
                    /> 
                    </div>
                    {/* <Select onValueChange={setBehaviorType}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select behavior type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Aggressive">Aggressive</SelectItem>
                            <SelectItem value="Friendly">Friendly</SelectItem>
                            <SelectItem value="Shy">Shy</SelectItem>
                            <SelectItem value="Playful">Playful</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>  */}

                    <Label htmlFor="notes">Notes</Label>

                    <Textarea
                        placeholder="Notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                    <Label htmlFor="resolved">Resolved</Label>

                    <div className="flex items-center gap-2">
                        <Checkbox
                            checked={resolved}
                            onCheckedChange={(checked) => setResolved(Boolean(checked))}
                        />
                        <span>Resolved</span>
                    </div>
                </div>

                <DialogFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleAdd}>Add</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}

export default BehaviorModal
