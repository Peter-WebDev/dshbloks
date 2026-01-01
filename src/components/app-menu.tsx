import { useNavigate } from "@solidjs/router";
import { Show } from "solid-js";
import { signOut, useSession } from "~/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button, buttonVariants } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { showToast } from "./ui/toast";

const links = [
    { href: "/sign-in", label: "Sign In" },
    { href: "/sign-up", label: "Sign Up" },
    { href: "/account", label: "Account" },
    { href: "/sign-out", label: "Sign Out" },
];

export default function Dropdown() {
    const navigate = useNavigate();
    const session = useSession();

    const isLoggedIn = () => !!session().data?.user;

    return (
        <DropdownMenu modal={true}>
            <div class="flex justify-between items-start gap-2">
                <Avatar>
                    <AvatarImage src="/favicon-32x32.png" alt="User Avatar" />
                    <AvatarFallback>DU</AvatarFallback>
                </Avatar>
                <DropdownMenuTrigger as={Button<"button">} class={buttonVariants({ size: "icon", variant: "default" })} aria-label="Menu">
                    ⚙
                </DropdownMenuTrigger>
            </div>
            <DropdownMenuContent>
                <DropdownMenuLabel>Dshbloks Menu</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Show when={!isLoggedIn()}>
                    <DropdownMenuItem onSelect={() => navigate("/sign-in")}>{links[0].label}</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => navigate("/sign-up")}>{links[1].label}</DropdownMenuItem>
                </Show>
                <Show when={isLoggedIn()}>
                    <DropdownMenuItem onSelect={() => navigate("/account")}>{links[2].label}</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={async () => {
                        await signOut();
                        showToast({
                            title: "Signed out",
                            description: "You have been logged out.",
                            variant: "success",
                        });
                        window.location.reload();
                    }}
                    >
                        {links[3].label}
                    </DropdownMenuItem>
                </Show>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}