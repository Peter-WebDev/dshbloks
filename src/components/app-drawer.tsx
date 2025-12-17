import { For } from "solid-js";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "~/components/ui/drawer";
import { Grid } from "./ui/grid";

const widgets = [
    { id: 1, content: "1" },
    { id: 2, content: "2" },
    { id: 3, content: "3" },
    { id: 4, content: "4" },
    { id: 5, content: "5" },
    { id: 6, content: "6" }
];

export default function AppDrawer() {
    return (
        <Drawer snapPoints={[0, 1]} modal={false}>
            <DrawerTrigger>W</DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle><h2>Widgets</h2></DrawerTitle>
                    <DrawerDescription>Drag and drop.</DrawerDescription>
                </DrawerHeader>
                <Grid cols={3} class="px-4 pb-4 gap-4">
                    <For each={widgets}>{(widget) => (
                        <div class="w-full h-16 bg-secondary flex items-center justify-center">{widget.content}</div>
                    )}
                    </For>
                </Grid>
            </DrawerContent>
        </Drawer>
    );
}