export interface Validatable {
    value: string | number;
    required: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

export function validate(property: Validatable): boolean {
    let isValid = true;

    if (property.required) isValid &&= property.value.toString().trim().length > 0;

    switch (typeof property.value) {
        case 'number':
            if (property.min != null) isValid &&= property.value >= property.min;
            if (property.max != null) isValid &&= property.value <= property.max;
            
            break;
            
        case 'string':
            if (property.minLength != null) isValid &&= property.value.trim().length >= property.minLength;
            if (property.maxLength != null) isValid &&= property.value.trim().length <= property.maxLength;

            break;
            
        default:
    }

    return isValid;
}
