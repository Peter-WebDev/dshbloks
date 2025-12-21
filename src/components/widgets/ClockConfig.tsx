import { createSignal } from "solid-js";
import type { ClockConfig } from "~/lib/types";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem, RadioGroupItemLabel } from "../ui/radio-group";
import { TextField, TextFieldLabel } from "../ui/text-field";

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

    const handleFormatChange = (value: string) => {
        setFormat24h(value === "24");
    };

    return (
        <div class="w-full space-y-6">
            <div class="text-center mb-6">
                <div class="text-4xl mb-2">🕐</div>
                <h3 class="text-lg font-semibold">Configure Clock</h3>
                <p class="text-sm text-muted-foreground">
                    Choose your timezone and time format
                </p>
            </div>

            <div class="space-y-4">
                <TextField class="w-full">
                    <TextFieldLabel for="timezone">Timezone</TextFieldLabel>
                    <select
                        id="timezone"
                        value={timezone()}
                        onChange={(e) => setTimezone(e.target.value)}
                    >
                        {TIMEZONES.map((tz) => (
                            <option value={tz.value}>{tz.label}</option>
                        ))}
                    </select>
                </TextField>

                <div class="w-full">
                    <TextFieldLabel for="format">Time Format</TextFieldLabel>
                    <RadioGroup
                        value={format24h() ? "24" : "12"}
                        onChange={handleFormatChange}
                        class="flex gap-4 mt-2"
                    >
                        <RadioGroupItem value="24">
                            <RadioGroupItemLabel>24-hour</RadioGroupItemLabel>
                        </RadioGroupItem>
                        <RadioGroupItem value="12">
                            <RadioGroupItemLabel>12-hour</RadioGroupItemLabel>
                        </RadioGroupItem>
                    </RadioGroup>
                </div>
                <div class="flex gap-2 pt-4">
                    <Button
                        variant="outline"
                        class="flex-1"
                        onClick={props.onCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="default"
                        class="flex-1"
                        onClick={handleSave}
                    >
                        Save
                    </Button>
                </div>
            </div>
        </div>
    )
}