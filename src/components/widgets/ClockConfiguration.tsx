import { RadioGroup } from "@kobalte/core/radio-group";
import { createSignal } from "solid-js";
import type { ClockConfig } from "~/lib/types";
import { Button } from "../ui/button";
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
    { value: "America/New_York", label: "America/New York" },
    { value: "America/Los_Angeles", label: "America/Los Angeles" },
    { value: "Asia/Tokyo", label: "Asia/Tokyo" },
    { value: "Australia/Sydney", label: "Australia/Sydney" },
] as const;

export default function ClockConfiguration(props: ClockConfigProps) {
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
            <div>
                <h3>🕐Configure Clock</h3>
                <p class="text-type-sm text-muted-foreground">
                    Choose your timezone and time format
                </p>
            </div>

            <div class="space-y-4">
                <TextField class="w-full">
                    <TextFieldLabel for="timezone">Timezone</TextFieldLabel>
                    <select
                        id="timezone"
                        name="timezones"
                        value={timezone()}
                        onChange={(e) => setTimezone(e.target.value)}
                        class="bg-accent text-accent-foreground p-2 w-full rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        {TIMEZONES.map((tz) => (
                            <option
                                value={tz.value}
                            >
                                {tz.label}
                            </option>
                        ))}
                    </select>
                </TextField>

                <div class="w-full">
                    <RadioGroup
                        id="format"
                        name="format"
                        value={format24h() ? "24" : "12"}
                        onChange={handleFormatChange}
                        class="flex gap-2 flex-wrap w-full"
                    >
                        <RadioGroup.Label>Time format</RadioGroup.Label>
                        <RadioGroup.Item value="24" class="flex items-center gap-2">
                            <RadioGroup.ItemInput />
                            <RadioGroup.ItemControl class="flex items-center justify-center h-4 w-4 border border-input rounded-full bg-background">
                                <RadioGroup.ItemIndicator class="h-2 w-2 rounded-full bg-primary" />
                            </RadioGroup.ItemControl>
                            <RadioGroup.ItemLabel>24-hour</RadioGroup.ItemLabel>
                        </RadioGroup.Item>
                        <RadioGroup.Item value="12" class="flex items-center gap-2">
                            <RadioGroup.ItemInput />
                            <RadioGroup.ItemControl class="flex items-center justify-center h-4 w-4 border border-input rounded-full bg-background">
                                <RadioGroup.ItemIndicator class="h-2 w-2 rounded-full bg-primary" />
                            </RadioGroup.ItemControl>
                            <RadioGroup.ItemLabel>12-hour</RadioGroup.ItemLabel>
                        </RadioGroup.Item>
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