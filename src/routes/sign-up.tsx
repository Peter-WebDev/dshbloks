import { A, useNavigate } from "@solidjs/router";
import SignUpForm from "~/components/auth/sign-up-form";
import { Button } from "~/components/ui/button";
import { Card, CardHeader } from "~/components/ui/card";
import { Grid } from "~/components/ui/grid";

export default function SignUp() {
    const navigate = useNavigate();

    const goBackOrHome = () => {
        navigate("/");
    };

    return (
        <main class="relative min-h-svh flex md:items-center md:justify-center">
            <Button
                type="button"
                variant="ghost"
                size="icon"
                class="absolute right-4 top-4"
                aria-label="Close"
                onClick={goBackOrHome}
            >
                ×
            </Button>
            <Grid cols={1} colsMd={2} class="w-full grid md:place-items-center gap-6">
                <Card class="md:min-h-svh w-full bg-accent">
                    <CardHeader class="w-min">
                        <div class="flex items-center gap-2">
                            <img src="/favicon-16x16.png" alt="" />
                            <A href="/">
                                Dshbloks
                            </A>
                        </div>
                    </CardHeader>
                </Card>
                <SignUpForm />
            </Grid>
        </main>
    );
}