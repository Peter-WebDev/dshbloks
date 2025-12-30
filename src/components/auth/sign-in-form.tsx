import { Separator } from "@kobalte/core/separator";
import { useNavigate } from "@solidjs/router";
import { signIn } from "~/lib/auth-client";
import { signInSchema } from "~/lib/validation/schemas";
import { useZodValidation } from "../../lib/form/use-form-zod";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "../ui/card";
import { TextField, TextFieldErrorMessage, TextFieldInput, TextFieldLabel } from "../ui/text-field";
import { showToast } from "../ui/toast";

export default function SignInForm() {
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
            showToast({
                title: "Sign in failed",
                description: error.message || "An unknown error occurred",
                variant: "destructive",
            });
            return;
        }
        showToast({
            title: "Welcome in!",
            description: "You have successfully signed in.",
            variant: "success",
        });
        navigate("/", { replace: true });
    };

    return (
        <Card class="w-full max-w-md px-6 mx-auto">
            <CardHeader class="space-y-1">
                <h1>Sign In</h1>
                <CardDescription>Enter your details below to sign in to your account and manage your dashboards.</CardDescription>
            </CardHeader>
            <CardContent class="grid gap-4">
                <form onSubmit={handleSubmit} novalidate class="space-y-6">
                    <TextField class="grid w-full max-w-sm items-center gap-1.5"
                        validationState={emailField.hasError() ? "invalid" : "valid"}
                        value={emailField.value()}
                        onChange={emailField.onChange}
                    >
                        <TextFieldLabel for="email">Email</TextFieldLabel>
                        <TextFieldInput
                            id="email"
                            name="email"
                            type="email"
                            required
                            onBlur={emailField.onBlur}
                        />
                        <TextFieldErrorMessage>{emailField.error()}</TextFieldErrorMessage>
                    </TextField>

                    <TextField class="grid w-full max-w-sm items-center gap-1.5"
                        validationState={passwordField.hasError() ? "invalid" : "valid"}
                        value={passwordField.value()}
                        onChange={passwordField.onChange}
                    >
                        <TextFieldLabel for="password">Password</TextFieldLabel>
                        <TextFieldInput
                            id="password"
                            name="password"
                            type="password"
                            required
                            onBlur={passwordField.onBlur}
                        />
                        <TextFieldErrorMessage>{passwordField.error()}</TextFieldErrorMessage>
                    </TextField>
                    <Button type="submit" class="w-full">Sign In</Button>
                    <p class="text-sm text-muted-foreground text-center">No account yet? <a href="/sign-up">Sign up</a></p>
                </form>
            </CardContent>
            <CardFooter class="grid">
                <div class="flex gap-3">
                    <Separator class="grow mt-2.5" />
                    <p class="text-type-xs uppercase">Or sign in with</p>
                    <Separator class="grow mt-2.5" />
                </div>
                <Button as="button" variant="secondary" class="w-full">
                    <img height="24" width="24" src="https://cdn.simpleicons.org/github/black/white" />Github
                </Button>
            </CardFooter>
        </Card>
    );
};