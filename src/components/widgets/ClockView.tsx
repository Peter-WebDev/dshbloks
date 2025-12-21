import { createEffect, createSignal } from "solid-js";
import { ClockConfig } from "~/lib/types";

interface ClockViewProps {
    config: ClockConfig;
}


export default function ClockView(props: ClockViewProps) {
    const [time, setTime] = createSignal("");
    const [date, setDate] = createSignal("");

    // Update time every second
    createEffect(() => {
        // updateTime
    });

    return (
        <div></div>
    );
}