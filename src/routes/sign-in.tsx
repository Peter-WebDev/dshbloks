import SignInForm from "~/components/auth/sign-in-form";
import { Card, CardHeader } from "~/components/ui/card";
import { Grid } from "~/components/ui/grid";

export default function SignIn() {
    return (
        <main class="min-h-svh flex md:items-center md:justify-center">
            <Grid cols={1} colsMd={2} class="w-full grid md:place-items-center gap-6">
                <Card class="md:min-h-svh w-full bg-accent">
                    <CardHeader>
                        <p>Dshbloks</p>
                    </CardHeader>
                </Card>
                <SignInForm />
            </Grid>
        </main>
    );
}