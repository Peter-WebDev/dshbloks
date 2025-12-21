import { createEffect, createSignal } from "solid-js";
import type { ClockConfig } from "~/lib/types";

interface ClockEditProps {
    config: ClockConfig;
    onEdit: () => void;
    onDelete: () => void;
}

export default function ClockEdit(props: ClockEditProps) {
    const [time, setTime] = createSignal("");
    const [showDeleteDialog, setShowDeleteDialog] = createSignal(false);

    createEffect(() => {
        // updateTime
    });

    // handleDelete

    return (
        <div></div>
    );
}