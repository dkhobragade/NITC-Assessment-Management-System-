import { Input } from "@mantine/core";


const InputField = ( { placeholder, value, onChange } ) =>
{

    return <Input size="lg" placeholder={ placeholder } value={ value } onChange={ onChange } />
}

export default InputField