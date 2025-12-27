import { createDraggable } from "@thisbeyond/solid-dnd";
import { For, type ComponentProps } from "solid-js";
import { WIDGET_TEMPLATES, type WidgetTemplate } from "~/lib/types";
import Dropdown from "./app-menu";
import { Grid } from "./ui/grid";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "./ui/sidebar";

declare module "solid-js" {
    namespace JSX {
        interface Directives {
            draggable: boolean;
            droppable: boolean;
        }
    }
}

const TemplateItem = (props: { template: WidgetTemplate }) => {
    const draggable = createDraggable(`template:${props.template.id}`);
    return (
        <div
            class="w-full h-full bg-secondary rounded-lg border-border border-2 cursor-grab touch-none"
            use:draggable
            classList={{ "opacity-25": draggable.isActiveDraggable }}
        >
            <div class="p-4 flex flex-col items-center gap-2">
                <div class="text-4xl mb-2">{props.template.icon}</div>
                <div class="flex-1 text-center space-y-1">
                    <div class="font-medium">{props.template.name}</div>
                </div>
            </div>
        </div>
    );
};


export function AppSidebar(props: ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar {...props} class="rounded-r-xl px-4">
            <SidebarHeader class="py-4">
                <Dropdown />
            </SidebarHeader>
            <SidebarContent>
                <div>
                    <h2>Widgets</h2>
                    <p class="text-type-sm text-muted-foreground">Drag a widget into the dashboard slots</p>
                </div>
                <Grid cols={2} class="gap-4">
                    <For each={WIDGET_TEMPLATES}>{(template) => (
                        <TemplateItem template={template} />
                    )}</For>
                </Grid>
            </SidebarContent>
            <SidebarFooter>
                <p class="text-type-xs text-muted-foreground">© 2025 Dshbloks</p>
            </SidebarFooter>
        </Sidebar>
    );
}