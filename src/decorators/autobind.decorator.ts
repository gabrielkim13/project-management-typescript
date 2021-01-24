namespace App {
    export const AutoBind: MethodDecorator = (_1, _2, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;
        const newDescriptor: PropertyDescriptor = {
            configurable: true,
            get() {
                return originalMethod.bind(this);
            }
        }
        
        return newDescriptor;
    }
}
