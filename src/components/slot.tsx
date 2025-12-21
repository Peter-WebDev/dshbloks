import { createDroppable } from "@thisbeyond/solid-dnd";
import { Match, Switch } from "solid-js";
import ClockConfiguration from "~/components/widgets/ClockConfiguration";
import ClockEdit from "~/components/widgets/ClockEdit";
import ClockView from "~/components/widgets/ClockView";
import { useApp } from "~/lib/store";
import type { ClockConfig, Slot as SlotType } from "~/lib/types";

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
    const {
        removeWidgetFromSlot,
        setSlotWidget,
        takeSnapshot,
        clearSnapshot,
        snapshots
    } = useApp();

    const isEmpty = () => !props.slot.widget;
    const isUnsaved = () => props.slot.widget && !props.slot.widget.saved;
    const isSaved = () => props.slot.widget && props.slot.widget.saved;
    const isEditMode = () => isSaved() && props.sidebarOpen;
    const isViewMode = () => isSaved() && !props.sidebarOpen;
    const isClock = () => props.slot.widget?.type === "clock";

    const handleClockSave = async (config: ClockConfig) => {
        if (!props.slot.widget) return;

        setSlotWidget(props.slot.id, {
            ...props.slot.widget,
            config: config,
            saved: true,
        });

        clearSnapshot(props.slot.id);
    };

    const handleClockCancel = () => {
        const snapshot = snapshots()[props.slot.id];

        if (snapshot) {
            setSlotWidget(props.slot.id, snapshot);
            clearSnapshot(props.slot.id);
        } else {
            removeWidgetFromSlot(props.slot.id);
        }
    };

    const handleClockEdit = () => {
        if (!props.slot.widget) return;

        takeSnapshot(props.slot.id, props.slot.widget);

        setSlotWidget(props.slot.id, {
            ...props.slot.widget,
            saved: false,
        });
    };

    const handleClockDelete = async () => {
        removeWidgetFromSlot(props.slot.id);
    };

    return (
        <div
            use:droppable
            class="relative bg-card border-2 border-dashed border-border rounded-lg p-6 min-h-[200px] flex items-center justify-center transition-colors"
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
                        <Switch>
                            <Match when={isClock()}>
                                <ClockConfiguration
                                    initialConfig={props.slot.widget?.config as ClockConfig}
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
                    <div class="w-full">
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
                    <div class="w-full h-full flex items-center justify-center">
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