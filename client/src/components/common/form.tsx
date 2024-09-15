import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";

interface FormControl {
    name: string;
    label: string;
    placeholder?: string;
    componentType: string;
    type: string;
    option?: { id: string, label: string }[];
}

interface CommonFormProps {
    formControl: FormControl[];
    formData: any;
    setFormData: any;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    buttonText?: string;
    isBtnDisabled?: boolean;
}

function CommonForm({
    formControl,
    formData,
    setFormData,
    onSubmit,
    buttonText,
}: CommonFormProps) {

    function renderInputs(getControlItem: FormControl) {
        let element = null;

        const value = formData[getControlItem.name] || ""

        // INPUT
        switch (getControlItem.componentType) {
            case "input":
                element = (
                    <Input
                        name={getControlItem.name}
                        placeholder={getControlItem.placeholder}
                        id={getControlItem.name}
                        type={getControlItem.type}
                        value={value}
                        onChange={(event) =>
                            setFormData({
                                ...formData,
                                [getControlItem.name]: event.target.value,
                            })
                        }
                    />
                );
                break;

            // Select
            case "select":
                element = (
                    <Select
                        onValueChange={(value) =>
                            setFormData({
                                ...formData,
                                [getControlItem.name]: value,
                            })
                        }
                        value={value}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={getControlItem.placeholder} />
                        </SelectTrigger>

                        <SelectContent>
                            {getControlItem.option && getControlItem.option.length > 0
                                ? getControlItem.option.map(optionItem => (
                                    <SelectItem key={optionItem.id} value={optionItem.id}>

                                    </SelectItem>
                                )) : null}
                        </SelectContent>
                    </Select>
                );
                break;

            // TEXTAREA
            case "textarea":
                element = (
                    <Textarea
                        name={getControlItem.name}
                        placeholder={getControlItem.placeholder}
                        id={getControlItem.name}
                        value={value}
                        onChange={(event) =>
                            setFormData({
                                ...formData,
                                [getControlItem.name]: event.target.value,
                            })
                        }
                    />
                );
                break;

            default:
                element = (
                    <Input
                        name={getControlItem.name}
                        placeholder={getControlItem.placeholder}
                        id={getControlItem.name}
                        type={getControlItem.type}
                        value={value}
                        onChange={(event) =>
                            setFormData({
                                ...formData,
                                [getControlItem.name]: event.target.value,
                            })
                        }
                    />
                );
                break;
        }

        return element;
    }

    return (
        <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-3">
                {formControl.map((controlIem) => (
                    <div className="grid w-full gap-1.5" key={controlIem.name}>
                        <label className="mb-1">{controlIem.label}</label>
                        {renderInputs(controlIem)}
                    </div>
                ))}
            </div>

            <Button type="submit" className="mt-10 w-full">
                {buttonText || 'Submit'}
            </Button>
        </form>
    );
}

export default CommonForm;