import { createEffect, createSignal, onCleanup } from "solid-js";
import { ClockConfig } from "~/lib/types";

interface ClockViewProps {
    config: ClockConfig;
}


export default function ClockView(props: ClockViewProps) {
    const [time, setTime] = createSignal("");
    const [date, setDate] = createSignal("");

    // Update time every second
    createEffect(() => {
        const updateTime = () => {
            const now = new Date();

            const timeFormatter = new Intl.DateTimeFormat("en-US", {
                timeZone: props.config.timezone,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: !props.config.format24h,
            });
            setTime(timeFormatter.format(now));

            const dateStr = now.toLocaleDateString("en-GB", {
                timeZone: props.config.timezone,
                day: "numeric",
                month: "short",
                year: "numeric",
            }).toLowerCase();
            setDate(dateStr);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        onCleanup(() => clearInterval(interval));
    });

    return (
        <div class="flex flex-col gap-2">
            <h2><span class="text-2xl">🕐{props.config.timezone.replace("_", " ")}</span></h2>
            <h3>
                <time class="text-7xl" datetime={new Date().toISOString()}>
                    {time()}
                </time>
            </h3>
            <h4 class="text-type-sm text-muted-foreground mb-2">
                {date()}
            </h4>
        </div>
    );
}