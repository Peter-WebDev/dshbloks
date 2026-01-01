import { useAction } from "@solidjs/router";
import { createDroppable } from "@thisbeyond/solid-dnd";
import { Match, Switch } from "solid-js";
import { showToast } from "~/components/ui/toast";
import ClockConfiguration from "~/components/widgets/ClockConfiguration";
import ClockEdit from "~/components/widgets/ClockEdit";
import ClockView from "~/components/widgets/ClockView";
import { Dashboard } from "~/generated/prisma/client";
import { createWidgetAction } from "~/lib/actions/widgets/create";
import { deleteWidgetAction } from "~/lib/actions/widgets/delete";
import type { CreateWidgetInput, DeleteWidgetInput, UpdateWidgetInput } from "~/lib/actions/widgets/types";
import { updateWidgetAction } from "~/lib/actions/widgets/update";
import { useApp } from "~/lib/store";
import type { ClockConfig, Slot as SlotType } from "~/lib/types";

interface SlotProps {
    slot: SlotType;
    sidebarOpen: boolean;
    dashboard: Dashboard | null | undefined;
}

const Slot = (props: SlotProps) => {
    const droppable = createDroppable(props.slot.id);
    const {
        removeWidgetFromSlot,
        setSlotWidget,
        takeSnapshot,
        clearSnapshot,
        snapshots
    } = useApp();

    const createWidget = useAction(createWidgetAction);
    const updateWidget = useAction(updateWidgetAction);
    const deleteWidget = useAction(deleteWidgetAction);

    const isEmpty = () => !props.slot.widget;
    const isUnsaved = () => props.slot.widget && !props.slot.widget.saved;
    const isSaved = () => props.slot.widget && props.slot.widget.saved;
    const isEditMode = () => isSaved() && props.sidebarOpen;
    const isViewMode = () => isSaved() && !props.sidebarOpen;
    const isClock = () => props.slot.widget?.type === "clock";

    const handleClockSave = async (config: ClockConfig) => {
        if (!props.slot.widget) return;

        // Check if user is authenticated or guest
        const dashboardData = props.dashboard;
        const isGuest = !dashboardData;

        // Check if we have a snapshot - if yes, it means we're editing an existing widget
        const snapshot = snapshots()[props.slot.id];
        const isNewWidget = !snapshot;

        // Guest mode - save locally
        if (isGuest) {
            setSlotWidget(props.slot.id, {
                ...props.slot.widget,
                config,
                saved: true,
            });
            showToast({
                title: "Widget saved locally",
                description: "Sign in to save to cloud",
            });
            clearSnapshot(props.slot.id);
            return;
        }

        // Authenticated user - create or update in database
        if (isNewWidget) {
            // Create new widget in DB
            const input: CreateWidgetInput = {
                dashboardId: dashboardData!.id,
                type: props.slot.widget.type,
                title: props.slot.widget.title,
                config: config,
                order: props.slot.widget.order,
                userId: dashboardData.userId,
            };

            const result = await createWidget(input);

            if (result.success && result.widget) {
                setSlotWidget(props.slot.id, {
                    id: result.widget.id,
                    type: result.widget.type,
                    title: result.widget.title,
                    config: result.widget.config,
                    order: result.widget.order,
                    dashboardId: result.widget.dashboardId,
                    saved: true,
                    createdAt: new Date(result.widget.createdAt),
                    updatedAt: new Date(result.widget.updatedAt),
                });

                showToast({
                    title: "Widget saved",
                    description: "Your clock widget has been saved.",
                    variant: "success",
                });
            } else {
                showToast({
                    title: "Save failed",
                    description: result.error || "Failed to save widget",
                    variant: "destructive",
                });
            }
        } else {
            // Update existing widget (snapshot exists)
            const input: UpdateWidgetInput = {
                id: snapshot.id,
                config: config,
                title: snapshot.title,
                userId: dashboardData!.userId,
            };

            const result = await updateWidget(input);

            if (result.success) {
                setSlotWidget(props.slot.id, {
                    ...snapshot,
                    config: config,
                    saved: true,
                });

                showToast({
                    title: "Widget updated",
                    description: "Your changes have been saved.",
                    variant: "success",
                });
            } else {
                showToast({
                    title: "Update failed",
                    description: result.error || "Failed to update widget",
                    variant: "destructive",
                });
            }
        }

        clearSnapshot(props.slot.id);
    };

    const handleClockCancel = () => {
        const snapshot = snapshots()[props.slot.id];

        if (snapshot) {
            // Restore from snapshot
            setSlotWidget(props.slot.id, snapshot);
            clearSnapshot(props.slot.id);
        } else {
            // New widget that was never saved - remove it
            removeWidgetFromSlot(props.slot.id);
        }
    };

    const handleClockEdit = () => {
        if (!props.slot.widget) return;

        // Take snapshot before entering edit mode
        takeSnapshot(props.slot.id, props.slot.widget);

        // Switch to config mode
        setSlotWidget(props.slot.id, {
            ...props.slot.widget,
            saved: false,
        });
    };

    const handleClockDelete = async () => {
        if (!props.slot.widget) return;

        // Check if user is authenticated or guest
        const dashboardData = props.dashboard;
        const isGuest = !dashboardData;

        // If authenticated and widget is saved in DB, delete from DB
        if (!isGuest && props.slot.widget.saved && props.slot.widget.id) {
            const input: DeleteWidgetInput = {
                id: props.slot.widget.id,
                userId: dashboardData.userId,
            };

            const result = await deleteWidget(input);

            if (result.success) {
                removeWidgetFromSlot(props.slot.id);
                showToast({
                    title: "Widget deleted",
                    description: "Your widget has been removed.",
                    variant: "success",
                });
            } else {
                showToast({
                    title: "Delete failed",
                    description: result.error || "Failed to delete widget",
                    variant: "destructive",
                });
            }
        } else {
            // Guest mode or unsaved - just remove from store
            removeWidgetFromSlot(props.slot.id);
            showToast({
                title: "Widget removed",
            });
        }
    };

    return (
        <div
            use:droppable
            class="relative bg-card border-2 border-dashed border-border rounded-lg p-6 min-h-[200px] flex items-center justify-center transition-colors"
            classList={{
                "border-primary/50 bg-primary/5": droppable.isActiveDroppable,
                "border-muted": !droppable.isActiveDroppable && isEmpty(),
                "border-solid border-border bg-card": !isEmpty(),
            }}
        >
            <Switch>
                <Match when={isEmpty()}>
                    <div class="text-muted-foreground text-sm flex flex-col items-center gap-2">
                        <span class="text-2xl">📥</span>
                        <span>Drop widget here</span>
                    </div>
                </Match>

                <Match when={isUnsaved()}>
                    <div class="w-full h-full p-4 flex flex-col items-center justify-center">
                        <Switch>
                            <Match when={isClock()}>
                                <ClockConfiguration
                                    initialConfig={props.slot.widget!.config as ClockConfig}
                                    onSave={handleClockSave}
                                    onCancel={handleClockCancel}
                                />
                            </Match>
                            <Match when={true}>
                                <div class="text-center">
                                    <div class="text-2xl mb-2">⚙️</div>
                                    <h3 class="font-semibold">Configure {props.slot.widget?.type}</h3>
                                </div>
                            </Match>
                        </Switch>
                    </div>
                </Match>

                <Match when={isEditMode()}>
                    <div class="w-full h-full p-4">
                        <Switch>
                            <Match when={isClock()}>
                                <ClockEdit
                                    config={props.slot.widget?.config as ClockConfig}
                                    onEdit={handleClockEdit}
                                    onDelete={handleClockDelete}
                                />
                            </Match>
                            <Match when={true}>
                                <div class="text-center">
                                    <div class="text-2xl mb-2">✏️</div>
                                    <h3 class="font-semibold">{props.slot.widget?.type}</h3>
                                </div>
                            </Match>
                        </Switch>
                    </div>
                </Match>

                <Match when={isViewMode()}>
                    <div class="w-full h-full flex items-center justify-center p-4">
                        <Switch>
                            <Match when={isClock()}>
                                <ClockView config={props.slot.widget?.config as ClockConfig} />
                            </Match>
                            <Match when={true}>
                                <div class="text-center">
                                    <div class="text-4xl mb-2">📊</div>
                                    <div class="text-sm text-muted-foreground">View mode not implemented</div>
                                </div>
                            </Match>
                        </Switch>
                    </div>
                </Match>
            </Switch>
        </div>
    );
};

export default Slot;