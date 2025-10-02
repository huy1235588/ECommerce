import { Box, Checkbox, FormHelperText, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent } from "@mui/material";

interface MultipleSelectFormProps {
    id: string;
    name: string;
    label: string;
    placeholder: string;
    labelOptional?: string;
    value?: string;
    menuItems: string[];
    onChange: (e: SelectChangeEvent<string>) => void;
    error?: boolean;
    setError: (name: string, value: string) => void;
    errorText?: string;
}

// The following code is a reusable component that creates a multiple select form.
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const SelectForm: React.FC<MultipleSelectFormProps> = (
    {
        id,
        name,
        label,
        placeholder,
        labelOptional,
        value,
        menuItems,
        onChange,
        error,
        setError,
        errorText,
    }
) => {
    return (
        <Box
            sx={{
                width: "100%",
                margin: "1rem 0 0.5rem",
            }}
        >
            <InputLabel
                sx={{
                    display: "inline-block",
                    width: "auto",
                    fontWeight: "bold",
                    marginBottom: "0.25rem",
                    marginLeft: "0.125rem",
                }}
            >
                {label}
                {labelOptional !== "" ? (
                    <span
                        style={{
                            color: "gray",
                            marginLeft: "0.25rem",
                        }}
                    >
                        {labelOptional}
                    </span>
                ) : null}
            </InputLabel>

            <Select
                id={id}
                name={name}
                displayEmpty
                value={value}
                onChange={(e) => {
                    onChange(e);
                    setError(name, "");
                }}
                input={<OutlinedInput />}
                renderValue={(selected) => (
                    selected.length === 0 ? (
                        <em style={{ color: "gray" }}>
                            {placeholder}
                        </em>
                    ) : (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                            {value}
                        </Box>
                    )
                )}
                MenuProps={MenuProps}
                sx={{
                    width: "100%",
                    maxHeight: "200px",
                }}
                error={error}
            >
                {menuItems.map((name) => (
                    <MenuItem key={name} value={name}>
                        <Checkbox
                            checked={value?.includes(name) ?? false}
                        />
                        <ListItemText primary={name} />
                    </MenuItem>
                ))}
            </Select>

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
};

export default SelectForm;