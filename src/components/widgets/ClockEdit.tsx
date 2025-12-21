import { createEffect, createSignal, onCleanup } from "solid-js";
import type { ClockConfig } from "~/lib/types";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "../ui/alert-dialog";
import { Button } from "../ui/button";

interface ClockEditProps {
    config: ClockConfig;
    onEdit: () => void;
    onDelete: () => void;
}

export default function ClockEdit(props: ClockEditProps) {
    const [time, setTime] = createSignal("");
    const [showDeleteDialog, setShowDeleteDialog] = createSignal(false);

    createEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const formatter = new Intl.DateTimeFormat("en-US", {
                timeZone: props.config.timezone,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: !props.config.format24h,
            });
            setTime(formatter.format(now));
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        onCleanup(() => clearInterval(interval));
    });

    const handleDelete = () => {
        setShowDeleteDialog(false);
        props.onDelete();
    };

    return (
        <div class="w-full space-y-6">
            <div class="text-center">
                <div class="text-4xl mb-2">🕐</div>
                <div class="text-3xl font-bold mb-2">{time()}</div>
                <div class="text-sm text-muted-foreground">
                    {props.config.timezone}
                </div>
            </div>

            <div class="flex gap-2">
                <Button
                    variant="outline"
                    class="flex-1"
                    onClick={props.onEdit}
                    aria-label="Edit"
                >
                    ✏️
                </Button>
                <Button
                    variant="destructive"
                    class="flex-1"
                    onClick={() => setShowDeleteDialog(true)}
                    aria-label="Delete"
                >
                    🗑️
                </Button>
            </div>

            <AlertDialog open={showDeleteDialog()} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogTitle>Delete Clock Widget</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this clock widget? This action cannot be undone.
                    </AlertDialogDescription>
                    <div class="flex gap-2">
                        <Button
                            variant="outline"
                            class="flex-1"
                            onClick={() => setShowDeleteDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            class="flex-1"
                            onClick={handleDelete}
                        >
                            Continue
                        </Button>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}