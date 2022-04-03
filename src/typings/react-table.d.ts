import 'react-table';


declare module 'react-table'{
    export interface Cell<D extends object = {}, V = any> extends Cell<D, V> {
        isRowSpanned: boolean;
        rowSpan: string;
    }
}