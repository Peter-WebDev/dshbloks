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

            const dateFormatter = new Intl.DateTimeFormat("en-US", {
                timeZone: props.config.timezone,
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
            });
            setDate(dateFormatter.format(now));
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        onCleanup(() => clearInterval(interval));
    });

    return (
        <div class="flex flex-col gap-2 items-center justify-center">
            <h2>Clock</h2>
            <div class="text-5xl mb-2">🕐</div>
            <h3>
                <time class="text-4xl font-bold mb-2" datetime={new Date().toISOString()}>
                    {time()}
                </time>
            </h3>
            <div class="text-type-sm text-muted-foreground mb-2">
                {date()}
            </div>
            <div class="text-type-xs text-muted-foreground">
                {props.config.timezone}
            </div>
        </div>
    );
}