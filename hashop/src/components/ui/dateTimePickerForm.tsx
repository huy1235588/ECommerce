import { Box, InputLabel, SxProps, FormHelperText } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";

interface DateTimePickerFormProps {
    label: string;
    name: string;
    value: Dayjs | null;
    onChange: (name: string, date: Dayjs | null) => void;
    sx?: SxProps;
    error?: boolean;
    setError: (name: string, value: string) => void;
    errorText?: string;
}

const DateTimePickerForm: React.FC<DateTimePickerFormProps> = ({
    label,
    name,
    value,
    onChange,
    sx,
    error,
    setError,
    errorText,
}) => {
    return (
        <Box
            sx={{
                width: "100%",
                margin: "1rem 0 0.5rem",
                ...sx,
            }}
        >
            <InputLabel>
                {label}
            </InputLabel>

            <DateTimePicker
                value={value}
                name={name}
                onChange={(value) => {
                    onChange(name, value);
                    setError(name, "");
                }}
                slotProps={{
                    textField: {
                        fullWidth: true,
                        error: error,
                    }
                }}
            />

            {error && errorText && (
                <FormHelperText
                    error
                    style={{
                        position: "absolute",
                    }}
                >
                    {errorText}
                </FormHelperText>
            )}
        </Box>
    );
}

export default DateTimePickerForm;