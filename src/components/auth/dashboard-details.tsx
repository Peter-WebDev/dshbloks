import { useNavigate } from "@solidjs/router";
import { createSignal, For, onMount, Show } from "solid-js";
import { signIn } from "~/lib/auth-client";
import { signInSchema } from "~/lib/validation/schemas";
import { useZodValidation } from "../../lib/form/use-form-zod";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import { RadioGroup, RadioGroupItem, RadioGroupItemLabel } from "../ui/radio-group";
import { TextField, TextFieldInput } from "../ui/text-field";
import { showToast } from "../ui/toast";

export default function DashboardDetails() {
    // Mockad dashboard-lista
    const [dashboards, setDashboards] = createSignal([
        { id: "1", name: "Personal", active: true },
        { id: "2", name: "Work", active: false },
        { id: "3", name: "Side Project", active: false },
        { id: "4", name: "Test", active: false }
    ]);

    const [activeId, setActiveId] = createSignal("1");
    const [editId, setEditId] = createSignal<string | null>(null);
    const [editValue, setEditValue] = createSignal("");
    const [deleteId, setDeleteId] = createSignal<string | null>(null);

    function saveEdit(id: string) {
        setDashboards(ds =>
            ds.map(d =>
                d.id === id ? { ...d, name: editValue() } : d
            )
        );
        setEditId(null);
    }

    function confirmDelete() {
        setDashboards(ds => ds.filter(d => d.id !== deleteId()));
        setDeleteId(null);
    }

    const { validateForm, getFieldState } = useZodValidation(signInSchema);
    const navigate = useNavigate();

    const emailField = getFieldState("email");
    const passwordField = getFieldState("password");

    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault();

        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
        const result = validateForm(formData);

        if (!result.success) {
            showToast({
                title: "Oops!",
                description: "Please fill in the form.",
                variant: "destructive",
            });
            return;
        }

        const { data, error } = await signIn.email({
            email: result.data.email,
            password: result.data.password,
        });

        if (error) {
            console.error("Sign in failed:", error);
            // TODO: Show error to user
            showToast({
                title: "Sign in failed",
                description: error.message || "An unknown error occurred",
                variant: "destructive",
            });
            return;
        }
        sessionStorage.setItem("pendingToast", JSON.stringify({
            title: "Welcome in!",
            description: "You have successfully signed in.",
            variant: "success",
        }));

        navigate("/", { replace: true });
    };

    return (
        <Card class="w-full max-w-md mx-auto">
            <CardHeader>
                <h1>Dashboards</h1>
                <CardDescription>Handle your dashboards.</CardDescription>
            </CardHeader>
            <CardContent class="grid gap-4">
                <div class="flex justify-between gap-2 mb-2 text-type-xs">
                    <div class="flex gap-1 justify-between">
                        <span>●</span>
                        <span>= Active dashboard</span>
                    </div>
                    <div class="flex gap-4">
                        <span>Edit</span>
                        <span>Delete</span>
                    </div>
                </div>
                <RadioGroup value={activeId()} onChange={setActiveId} class="space-y-2">
                    <For each={dashboards()}>{(dashboard) => (
                        <div class="flex items-center gap-2">
                            <RadioGroupItem
                                value={dashboard.id}
                                class="flex-1"
                            >
                                <Show when={editId() === dashboard.id} fallback={
                                    <RadioGroupItemLabel>
                                        {dashboard.name}
                                    </RadioGroupItemLabel>
                                }>
                                    <TextField>
                                        <TextFieldInput
                                            ref={el => {
                                                onMount(() => el && el.focus());
                                            }}
                                            class="bg-transparent outline-none px-1"
                                            type="text"
                                            value={editValue()}
                                            onInput={(e) => setEditValue(e.currentTarget.value)}
                                            onBlur={() => saveEdit(dashboard.id)}
                                            onKeyDown={e => {
                                                if (e.key === "Enter") saveEdit(dashboard.id);
                                            }}
                                        />
                                    </TextField>
                                </Show>
                            </RadioGroupItem>
                            <Button
                                size="icon"
                                variant="secondary"
                                aria-label="Edit"
                                onClick={() => {
                                    setEditId(dashboard.id);
                                    setEditValue(dashboard.name);
                                }}
                            >
                                ✎
                            </Button>
                            <AlertDialog open={deleteId() === dashboard.id} onOpenChange={open => open ? setDeleteId(dashboard.id) : setDeleteId(null)}>
                                <AlertDialogTrigger as={Button} variant="destructive" size="icon" aria-label="Delete" disabled={dashboard.id === activeId()}>
                                    🗑
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogTitle>Delete board:</AlertDialogTitle>
                                    <h3><em>{dashboard.name}</em></h3>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete <em>{dashboard.name}</em>? This action cannot be undone.
                                    </AlertDialogDescription>
                                    <div class="mt-4 flex justify-end gap-2">
                                        <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
                                        <Button variant="destructive" onClick={confirmDelete}>Continue</Button>
                                    </div>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    )}
                    </For>
                </RadioGroup>
            </CardContent>
        </Card>
    );
};