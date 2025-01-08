import { Box, InputLabel, SxProps } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";

interface DateTimePickerFormProps {
    label: string;
    value: Dayjs | null;
    onChange: (date: Dayjs | null) => void;
    sx?: SxProps;
}

const DateTimePickerForm: React.FC<DateTimePickerFormProps> = ({
    label,
    value,
    onChange,
    sx,
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
                onChange={onChange}
                slotProps={{
                    textField: {
                        fullWidth: true
                    }
                }}
            />
        </Box>
    );
}

export default DateTimePickerForm;