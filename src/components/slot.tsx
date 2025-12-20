import { createDroppable } from "@thisbeyond/solid-dnd";
import { Match, Switch } from "solid-js";
import type { Slot as SlotType } from "~/lib/types";

interface SlotProps {
    slot: SlotType;
    sidebarOpen: boolean;
}

declare module "solid-js" {
    namespace JSX {
        interface Directives {
            droppable: boolean;
        }
    }
}

const Slot = (props: SlotProps) => {
    const droppable = createDroppable(props.slot.id);

    // Determine widget state
    const isEmpty = () => !props.slot.widget;
    const isUnsaved = () => props.slot.widget && !props.slot.widget.saved;
    const isSaved = () => props.slot.widget && props.slot.widget.saved;
    const isEditMode = () => isSaved() && props.sidebarOpen;
    const isViewMode = () => isSaved() && !props.sidebarOpen;

    return (
        <div
            use:droppable
            class="relative bg-card border-2 border-dashed border-border rounded-lg p-6 min-h-[200px] flex items-center justify-center transition-colors duration-300"
            classList={{
                "!border-primary !bg-primary/10": droppable.isActiveDroppable,
                "border-solid": !isEmpty(),
            }}
        >
            <Switch>
                <Match when={isEmpty()}>
                    <div class="text-muted-foreground text-center">
                        <div class="text-4xl mb-2">📦</div>
                        <div class="text-sm font-medium">Drop widget here</div>
                        <div class="text-xs mt-1">Slot {props.slot.id}</div>
                    </div>
                </Match>
                <Match when={isUnsaved()}>
                    <div class="w-full">
                        <div class="text-center mb-4">
                            <div class="text-2xl mb-2">⚙️</div>
                            <h2>Configure {props.slot.widget?.type}</h2>
                        </div>
                        {/* Config component will be rendered here based on widget type */}
                        <div class="text-sm text-muted-foreground text-center">
                            Config mode placeholder
                        </div>
                    </div>
                </Match>
                <Match when={isEditMode()}>
                    <div class="w-full">
                        <div class="text-center mb-4">
                            <div class="text-2xl mb-2">✏️</div>
                            <h2>{props.slot.widget?.type}</h2>
                        </div>
                        {/* Edit component will be rendered here based on widget type */}
                        <div class="text-sm text-muted-foreground text-center">
                            Edit mode placeholder
                        </div>
                    </div>
                </Match>
                <Match when={isViewMode()}>
                    <div class="w-full h-full flex items-center justify-center">
                        {/* View component will be rendered here based on widget type */}
                        <div class="text-center">
                            <div class="text-4xl mb-2">🕐</div>
                            <div class="text-sm text-muted-foreground">
                                View mode placeholder
                            </div>
                        </div>
                    </div>
                </Match>
            </Switch>
        </div>
    );
}

export default Slot;