/**
 * Create class decorator that logs the function name and arguments when called if verbose config is true
 */
 export function AttachToAllClassDecorator<T>() {
    return function(target: new (...params: any[]) => T) {
        console.log(target);
        for (const key of Object.getOwnPropertyNames(target.prototype)) {
            // maybe blacklist methods here
            let descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
            if (descriptor) {
                descriptor = logDecorator()(key, descriptor);
                Object.defineProperty(target.prototype, key, descriptor);
            }
        }
    }
}

function logDecorator(): (methodName: string, descriptor: PropertyDescriptor) => PropertyDescriptor {
    return (methodName: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
        let method = descriptor.value;
        
        descriptor.value = function(...args: any[]) {
            console.log(methodName + "(" + args.join(", ") + ")");
            let result = method.apply(this, args);
            console.log("=> " + result);
            return result
        }

        return descriptor;
    }
}