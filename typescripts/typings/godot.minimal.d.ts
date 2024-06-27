
declare module "godot-jsb" {
    import { Callable as GDCallable, Object as GDObject, PackedByteArray, PropertyUsageFlags, PropertyHint, MethodFlags, Variant } from "godot";

    const DEV_ENABLED: boolean;
    const TOOLS_ENABLED: boolean;

    const VERSION_MAJOR: number;
    const VERSION_MINOR: number;
    const VERSION_PATCH: number;

    /**
     * Create godot Callable with a bound object `self`
     */
    function callable(self: GDObject, fn: Function): GDCallable;

    /**
     * Create godot Callable without a bound object
     */
    function callable(fn: Function): GDCallable;

    /**
     * If the given `self` is instance of `godot.Object` and is still alive.
     */
    function is_instance_valid(self: GDObject): boolean;

    /**
     * Explicitly convert a `PackedByteArray`(aka Vector<uint8_t>) into a javascript `ArrayBuffer`
     */
    function to_array_buffer(packed: PackedByteArray): ArrayBuffer;

    interface ScriptPropertyInfo {
        name: string;
        type: Variant.Type;
        class_?: Function;
        hint?: number;
        hint_string?: string;
        usage?: number;
    }

    namespace internal {
        type OnReadyEvaluatorFunc = (self: any) => any;

        function add_script_signal(target: any, name: string): void;
        function add_script_property(target: any, details: ScriptPropertyInfo): void;
        function add_script_ready(target: any, details: { name: string, evaluator: string | OnReadyEvaluatorFunc }): void;
        function add_script_tool(target: any): void;
        function add_script_icon(target: any, path: string): void;

        function add_module(id: string, obj: any): void;
        function find_module(id: string): any;
    }

    namespace editor {
        interface PrimitiveConstantInfo {
            name: string;
            type: Variant.Type;
            value: number; /* only if type is literal */
        }

        interface ConstantInfo {
            name: string;
            value: number; /** int64_t */
        }

        interface EnumInfo {
            name: string;

            literals: Array<string>;
            is_bitfield: boolean;
        }

        interface DefaultArgumentInfo
        {
            type: Variant.Type;
            value: any;
        }

        // we treat godot MethodInfo/MethodBind as the same thing here for simplicity
        //NOTE some fields will not be set if it's actually a MethodInfo struct
        interface MethodBind {
            id: number;
            name: string;
            
            hint_flags: MethodFlags;
            is_static: boolean;
            is_const: boolean;
            is_vararg: boolean;
            argument_count: number; /** int32_t */

            args_: Array<PropertyInfo>;
            default_arguments?: Array<DefaultArgumentInfo>;
            return_: PropertyInfo | undefined;
        }

        interface PropertyInfo {
            name: string;
            type: Variant.Type;
            class_name: string;
            hint: PropertyHint;
            hint_string: string;
            usage: PropertyUsageFlags;
        }

        interface PropertySetGetInfo {
            name: string;

            type: Variant.Type;
            index: number;
            setter: string;
            getter: string;

            info: PropertyInfo;
        }

        interface PrimitiveGetSetInfo {
            name: string;
            type: Variant.Type;
        }

        interface SignalInfo {
            name: string;
            method_: MethodBind;
        }

        interface ArgumentInfo {
            name: string;
            type: Variant.Type;
        }

        interface ConstructorInfo {
            arguments: Array<ArgumentInfo>
        }

        interface OperatorInfo {
            name: string;
            return_type: Variant.Type;
            left_type: Variant.Type;
            right_type: Variant.Type;
        }

        interface BasicClassInfo {
            name: string;
            methods: Array<MethodBind>;
            enums?: Array<EnumInfo>;
        }

        interface ClassInfo extends BasicClassInfo {
            super: string;

            properties: Array<PropertySetGetInfo>;
            virtual_methods: Array<MethodBind>;
            signals: Array<SignalInfo>;
            constants?: Array<ConstantInfo>;
        }

        interface PrimitiveClassInfo extends BasicClassInfo {
            name: string;

            constructors: Array<ConstructorInfo>;
            operators: Array<OperatorInfo>;
            properties: Array<PrimitiveGetSetInfo>;
            constants?: Array<PrimitiveConstantInfo>;
        }

        interface SingletonInfo {
            name: string;
            class_name: string;
            user_created: boolean;
            editor_only: boolean;
        }

        interface GlobalConstantInfo {
            name: string;
            values: { [name: string]: number /** int64_t */ };
        }

        interface ClassDoc {
            brief_description: string;

            constants: { [name: string]: { description: string } };
            methods: { [name: string]: { description: string } };
            properties: { [name: string]: { description: string } };
            signals: { [name: string]: { description: string } };
        }

        function get_class_doc(class_name: string): ClassDoc | undefined;

        /**
         * get a list of all classes registered in ClassDB
         */
        function get_classes(): Array<ClassInfo>;

        function get_primitive_types(): Array<PrimitiveClassInfo>;

        function get_singletons(): Array<SingletonInfo>;

        function get_global_constants(): Array<GlobalConstantInfo>;

        // SO FAR, NOT USED
        function get_utility_functions(): Array<MethodBind>;

        function delete_file(filepath: string): void;
        
        const VERSION_DOCS_URL: string;
    }
}

