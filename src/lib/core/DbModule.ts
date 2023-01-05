
import { IGenerateObject } from "./IGenerateObject";

export abstract class DbModule implements IGenerateObject {
    public abstract name: string;
    protected static_functions: Map<string, unknown> = new Map();
    protected dynamic_functions: Map<string, unknown> = new Map();
    protected static_object: { [x: string]: unknown };

    getName(): string {
        return this.name;
    }

    abstract create_static_functions(): Promise<void>;
    abstract create_dynamic_functions(): Promise<void>;

    async init(): Promise<void> {
        await this.create_static_functions();
        this.static_object = Object.fromEntries(this.static_functions);
    }

    async generate_object(): Promise<Record<string, unknown>> {
        await this.create_dynamic_functions();

        return {
            ...this.static_object,
            ...Object.fromEntries(this.dynamic_functions),
        };
    }
}