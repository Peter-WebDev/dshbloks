import { Separator } from "@kobalte/core/separator";
import { createSignal, Show } from "solid-js";
import { changePassword, useSession } from "~/lib/auth-client";
import { changePasswordSchema } from "~/lib/validation/schemas";
import { useZodValidation } from "../../lib/form/use-form-zod";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "../ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { TextField, TextFieldErrorMessage, TextFieldInput, TextFieldLabel } from "../ui/text-field";
import { showToast } from "../ui/toast";

export default function AccountDetails() {
    const session = useSession();

    const [open, setOpen] = createSignal(false);

    const { validateForm, getFieldState, resetForm } = useZodValidation(changePasswordSchema);

    const currentPasswordField = getFieldState("currentPassword");
    const newPasswordField = getFieldState("newPassword");
    const confirmPasswordField = getFieldState("confirmPassword");

    function clearFields() {
        currentPasswordField.reset();
        newPasswordField.reset();
        confirmPasswordField.reset();
        resetForm();
    }

    const handleChangePassword = async (e: SubmitEvent) => {
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

        const { data, error } = await changePassword({
            newPassword: result.data.newPassword,
            currentPassword: result.data.currentPassword,
            revokeOtherSessions: true,
        });

        if (error) {
            console.error("Change password failed:", error);
            // TODO: Show error to user
            showToast({
                title: "Change password failed",
                description: error.message || "An unknown error occurred",
                variant: "destructive",
            });
            return;
        }

        showToast({
            title: "Password changed",
            description: "Your password has been updated.",
            variant: "success",
        });
        setOpen(false);
    };


    return (
        <Card class="w-full max-w-md px-6 mx-auto">
            <CardHeader class="space-y-1">
                <h1>Account</h1>
                <p>Handle your account details.</p>
                <p class="text-type-sm">
                    User:{" "}
                    <Show when={!session().isPending} fallback="loading...">
                        {session().data?.user.name}
                    </Show>
                </p>
                <p class="text-type-sm">
                    Email:{" "}
                    <Show when={!session().isPending} fallback="loading...">
                        {session().data?.user.email}
                    </Show>
                </p>
                <CardDescription>Need to change your password is as easy as 1, 2, 3. Just follow the steps below.</CardDescription>
            </CardHeader>
            <CardContent class="grid gap-4">
                <Dialog open={open()} onOpenChange={setOpen}>
                    <DialogTrigger class="w-full" as={Button<"button">}>Change password</DialogTrigger>
                    <DialogContent class="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Change your password</DialogTitle>
                            <DialogDescription>
                                Enter your current password and choose a new password. Confirm then hit "Save changes" to update your password.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleChangePassword} novalidate class="space-y-6">
                            <TextField class="grid w-full max-w-sm items-center gap-1.5"
                                validationState={currentPasswordField.hasError() ? "invalid" : "valid"}
                                value={currentPasswordField.value()}
                                onChange={currentPasswordField.onChange}
                            >
                                <TextFieldLabel for="currentPassword">Current password</TextFieldLabel>
                                <TextFieldInput
                                    id="currentPassword"
                                    name="currentPassword"
                                    type="password"
                                    required
                                    onBlur={currentPasswordField.onBlur}
                                />
                                <TextFieldErrorMessage>{currentPasswordField.error()}</TextFieldErrorMessage>
                            </TextField>

                            <TextField class="grid w-full max-w-sm items-center gap-1.5"
                                validationState={newPasswordField.hasError() ? "invalid" : "valid"}
                                value={newPasswordField.value()}
                                onChange={newPasswordField.onChange}
                            >
                                <TextFieldLabel for="newPassword">New Password</TextFieldLabel>
                                <TextFieldInput
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    required
                                    onBlur={newPasswordField.onBlur}
                                />
                                <TextFieldErrorMessage>{newPasswordField.error()}</TextFieldErrorMessage>
                            </TextField>
                            <TextField
                                validationState={confirmPasswordField.hasError() ? "invalid" : "valid"}
                                value={confirmPasswordField.value()}
                                onChange={confirmPasswordField.onChange}
                            >
                                <TextFieldLabel for="confirmPassword">Confirm New Password</TextFieldLabel>
                                <TextFieldInput
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    onBlur={confirmPasswordField.onBlur}
                                />
                                <TextFieldErrorMessage>{confirmPasswordField.error()}</TextFieldErrorMessage>
                            </TextField>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setOpen(false);
                                        clearFields();
                                    }}>Cancel</Button>
                                <Button type="submit">Save</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardContent>
            <CardFooter class="grid">
                <div class="flex gap-3">
                    <Separator class="grow mt-2.5" />
                    <p class="text-type-xs uppercase">Or delete your account?</p>
                    <Separator class="grow mt-2.5" />
                </div>
                <Button type="button" variant="destructive" class="w-full">Delete account</Button>
            </CardFooter>
        </Card>
    );
};