import 'react-table';

// TODO remove this when up to react-table v8
declare module 'react-table'{
    export interface UseTableInstanceProps<D extends object> {
        preGlobalFilteredRows:any,
        setGlobalFilter:any
    }
}