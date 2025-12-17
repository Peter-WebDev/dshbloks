import { For, type ComponentProps } from "solid-js";
import Dropdown from "./app-menu";
import { Card } from "./ui/card";
import { Grid } from "./ui/grid";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "./ui/sidebar";

const widgets = [
    { id: 1, content: "1" },
    { id: 2, content: "2" },
    { id: 3, content: "3" },
    { id: 4, content: "4" },
    { id: 5, content: "5" },
    { id: 6, content: "6" }
];


export function AppSidebar(props: ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar {...props} class="rounded-r-xl px-4">
            <SidebarHeader class="py-4">
                <Dropdown />
            </SidebarHeader>
            <SidebarContent>
                <Grid cols={2} class="gap-4">
                    <For each={widgets}>{(widget) => (
                        <Card class="w-full h-full bg-secondary">
                            <div class="w-full h-16 bg-secondary flex items-center justify-center">{widget.content}</div>
                        </Card>
                    )}
                    </For>
                </Grid>
            </SidebarContent>
            <SidebarFooter>
                <p class="text-type-xs text-muted-foreground">© 2025 Dshbloks</p>
            </SidebarFooter>
        </Sidebar>
    );
}