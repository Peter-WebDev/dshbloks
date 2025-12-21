import { createSignal } from "solid-js";
import type { ClockConfig } from "~/lib/types";

interface ClockConfigProps {
    initialConfig: ClockConfig;
    onSave: (config: ClockConfig) => void;
    onCancel: () => void;
}

const TIMEZONES = [
    { value: "Europe/Stockholm", label: "Europe/Stockholm" },
    { value: "Europe/London", label: "Europe/London" },
    { value: "Europe/Paris", label: "Europe/Paris" },
    { value: "America/New_York", label: "America/New_York" },
    { value: "America/Los_Angeles", label: "America/Los_Angeles" },
    { value: "Asia/Tokyo", label: "Asia/Tokyo" },
    { value: "Australia/Sydney", label: "Australia/Sydney" },
] as const;

export default function ClockConfig(props: ClockConfigProps) {
    const [timezone, setTimezone] = createSignal(props.initialConfig.timezone);
    const [format24h, setFormat24h] = createSignal(props.initialConfig.format24h);

    const handleSave = () => {
        props.onSave({
            timezone: timezone(),
            format24h: format24h(),
        });
    };

    return (
        <div></div>
    )
}