import React, { useState, useEffect } from 'react';
import { usePopper } from 'react-popper';
import { grey } from 'helpers/Colors';
import ArrowUpIcon from 'components/img/ArrowUp';
import ArrowDownIcon from 'components/img/ArrowDown';
import ArrowLeftIcon from 'components/img/ArrowLeft';
import ArrowRightIcon from 'components/img/ArrowRight';
import TrashIcon from 'components/img/Trash';
import TextIcon from 'components/img/Text';
import MultiIcon from 'components/img/Multi';
import HashIcon from 'components/img/Hash';
import PlusIcon from 'components/img/Plus';
import { ActionTypes, DataTypes, shortId } from 'helpers/Constants';
import { databaseReducer } from './reducers/DatabaseDispatch';
import { LOGGER } from 'services/Logger';
import { HeaderProps } from 'react-table';

function getPropertyIcon(dataType:string) {
  switch (dataType) {
    case DataTypes.NUMBER:
      return <HashIcon />;
    case DataTypes.TEXT:
      return <TextIcon />;
    case DataTypes.SELECT:
      return <MultiIcon />;
    default:
      return null;
  }
}

/**
 * Control the width of the cell in function of the content of all rows and header
 * @param rows 
 * @param accessor 
 * @param headerText 
 * @returns 
 */
const getColumnWidth = (rows:any, accessor:any, headerText:any) => {
  const maxWidth = 400
  const magicSpacing = 12
  const cellLength = Math.max(
    ...rows.map((row:any) => (`${row.values[accessor]}` || '').length),
    headerText.length,
  )
  return Math.min(maxWidth, cellLength * magicSpacing)
}

/**
 * Default header of the table
 * @param headerProps 
 * @returns 
 */
 export default function Header(headerProps:HeaderProps<any>) {
     /** Header name state */
    const [header, setHeader] = useState((headerProps.column as any).label);
    /** Width of column state */
    headerProps.column.width=getColumnWidth(headerProps.rows, headerProps.column.id, headerProps.column.id);
    // const [width, setWidth] = useState(headerProps.column.width);
    //getColumnWidth
    function getHeader() {
        return (
            <div className="header-container">
                <div className="header-name">
                    {header}
                </div>
            </div>);
    }
    return getHeader();
 }

// export default function Header(headerProps:any) {
//     LOGGER.debug(`=>Header. headerProps: ${Object.keys(headerProps)}`);
//     /** reducer */
//     const dataDispatch = databaseReducer;

//     const [expanded, setExpanded] = useState(headerProps.created || false);
//     const [referenceElement, setReferenceElement] = useState(null);
//     const [popperElement, setPopperElement] = useState(null);
//     const [inputRef, setInputRef] = useState(null);
//     const { styles, attributes } = usePopper(referenceElement, popperElement, {
//         placement: 'bottom',
//         strategy: 'absolute',
//     });
//     const [header, setHeader] = useState(headerProps.label);
//     const [typeReferenceElement, setTypeReferenceElement] = useState(null);
//     const [typePopperElement, setTypePopperElement] = useState(null);
//     const typePopper = usePopper(typeReferenceElement, typePopperElement, {
//         placement: 'right',
//         strategy: 'fixed',
//     });
//     const [showType, setShowType] = useState(false);
//     const buttons = [
//         {
//         onClick: (e:any) => {
//             dataDispatch({
//             columnId: headerProps.id,
//             label: header,
//             },{type: ActionTypes.UPDATE_COLUMN_HEADER});
//             headerProps.setSortBy([{ id: headerProps.id, desc: false }]);
//             setExpanded(false);
//         },
//         icon: <ArrowUpIcon />,
//         label: 'Sort ascending',
//         },
//         {
//         onClick: (e:any) => {
//             dataDispatch({
//             columnId: headerProps.id,
//             label: header,
//             },{type: ActionTypes.UPDATE_COLUMN_HEADER});
//             headerProps.setSortBy([{ id: headerProps.id, desc: true }]);
//             setExpanded(false);
//         },
//         icon: <ArrowDownIcon />,
//         label: 'Sort descending',
//         },
//         {
//         onClick: (e:any) => {
//             dataDispatch({
//             columnId: headerProps.id,
//             label: header,
//             },{type: ActionTypes.UPDATE_COLUMN_HEADER});
//             dataDispatch({
//             type: ActionTypes.ADD_COLUMN_TO_LEFT,
//             columnId: headerProps.id,
//             focus: false,
//             },{type: ActionTypes.ADD_COLUMN_TO_LEFT});
//             setExpanded(false);
//         },
//         icon: <ArrowLeftIcon />,
//         label: 'Insert left',
//         },
//         {
//         onClick: (e:any) => {
//             dataDispatch({
//             columnId: headerProps.id,
//             label: header,
//             },{type: ActionTypes.UPDATE_COLUMN_HEADER});
//             dataDispatch({
//             columnId: headerProps.id,
//             focus: false,
//             },{type: ActionTypes.ADD_COLUMN_TO_RIGHT});
//             setExpanded(false);
//         },
//         icon: <ArrowRightIcon />,
//         label: 'Insert right',
//         },
//         {
//         onClick: (e:any) => {
//             dataDispatch({
//             columnId: headerProps.id,
//             label: header,
//             },{type: ActionTypes.UPDATE_COLUMN_HEADER});
//             dataDispatch({columnId: headerProps.id },{type: ActionTypes.DELETE_COLUMN});
//             setExpanded(false);
//         },
//         icon: <TrashIcon />,
//         label: 'Delete',
//         },
//     ];
//     const propertyIcon = getPropertyIcon(headerProps.dataType);

//     const types = [
//         {
//         onClick: (e:any) => {
//             dataDispatch({
//             columnId: headerProps.id,
//             dataType: DataTypes.SELECT,
//             },{type: ActionTypes.UPDATE_COLUMN_TYPE});
//             setShowType(false);
//             setExpanded(false);
//         },
//         icon: <MultiIcon />,
//         label: 'Select',
//         },
//         {
//         onClick: (e:any) => {
//             dataDispatch({
//             columnId: headerProps.id,
//             dataType: DataTypes.TEXT,
//             },{type: ActionTypes.UPDATE_COLUMN_TYPE});
//             setShowType(false);
//             setExpanded(false);
//         },
//         icon: <TextIcon />,
//         label: 'Text',
//         },
//         {
//         onClick: (e:any) => {
//             dataDispatch({
//             columnId: headerProps.id,
//             dataType: DataTypes.NUMBER,
//             },{type: ActionTypes.UPDATE_COLUMN_TYPE});
//             setShowType(false);
//             setExpanded(false);
//         },
//         icon: <HashIcon />,
//         label: 'Number',
//         },
//     ];

//     function handleKeyDown(e:any) {
//         if (e.key === 'Enter') {
//         dataDispatch({
//             type: 'update_column_header',
//             columnId: headerProps.id,
//             label: header,
//         },{type: ActionTypes.UPDATE_COLUMN_HEADER});
//         setExpanded(false);
//         }
//     }

//     function handleChange(e:any) {
//         setHeader(e.target.value);
//     }

//     function handleBlur(e:any) {
//         e.preventDefault();
//         dataDispatch({ type: 'update_column_header', columnId: headerProps.id, label: header },{type: ActionTypes.UPDATE_COLUMN_HEADER});
//     }

//     function getHeader() {
//         if (headerProps.headerProps !== 999999) {
//         return (
//             <>
//             <div className="th noselect d-inline-block">
//                 <div
//                 className="th-content"
//                 onClick={() => setExpanded(true)}
//                 ref={setReferenceElement}
//                 >
//                 <span className="svg-icon svg-gray icon-margin">
//                     {propertyIcon}
//                 </span>
//                 {headerProps.label}
//                 </div>
//                 <div className="resizer" />
//             </div>
//             {expanded && (
//                 <div className="overlay" onClick={() => setExpanded(false)} />
//             )}
//             {expanded && (
//                 <div
//                 ref={setPopperElement}
//                 style={{ ...styles.popper, zIndex: 3 }}
//                 {...attributes.popper}
//                 >
//                 <div
//                     className="bg-white shadow-5 border-radius-md"
//                     style={{
//                     width: 240,
//                     }}
//                 >
//                     <div
//                     style={{
//                         paddingTop: '0.75rem',
//                         paddingLeft: '0.75rem',
//                         paddingRight: '0.75rem',
//                     }}
//                     >
//                     <div className="is-fullwidth" style={{ marginBottom: 12 }}>
//                         <input
//                         className="form-input"
//                         ref={setInputRef}
//                         type="text"
//                         value={header}
//                         style={{ width: '100%' }}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         onKeyDown={handleKeyDown}
//                         />
//                     </div>
//                     <span className="font-weight-600 font-size-75 color-grey-500 text-transform-uppercase">
//                         Property Type
//                     </span>
//                     </div>
//                     <div className="list-padding">
//                     <button
//                         className="sort-button"
//                         type="button"
//                         onMouseEnter={() => setShowType(true)}
//                         onMouseLeave={() => setShowType(false)}
//                         ref={setTypeReferenceElement}
//                     >
//                         <span className="svg-icon svg-text icon-margin">
//                         {getPropertyIcon}
//                         </span>
//                         <span className="text-transform-capitalize">
//                         {headerProps.dataType}
//                         </span>
//                     </button>
//                     {showType && (
//                         <div
//                         className="shadow-5 bg-white border-radius-md list-padding"
//                         ref={setTypePopperElement}
//                         onMouseEnter={() => setShowType(true)}
//                         onMouseLeave={() => setShowType(false)}
//                         {...typePopper.attributes.popper}
//                         style={{
//                             ...typePopper.styles.popper,
//                             width: 200,
//                             backgroundColor: 'white',
//                             zIndex: 4,
//                         }}
//                         >
//                         {types.map(type => (
//                             <button className="sort-button" onClick={type.onClick}>
//                             <span className="svg-icon svg-text icon-margin">
//                                 {type.icon}
//                             </span>
//                             {type.label}
//                             </button>
//                         ))}
//                         </div>
//                     )}
//                     </div>
//                     <div
//                     className="list-padding"
//                     key={shortId()}
//                     style={{
//                         borderTop: `2px solid ${grey(200)}`,
//                     }}
//                     >
//                     {buttons.map(button => (
//                         <button
//                         type="button"
//                         className="sort-button"
//                         onMouseDown={button.onClick}
//                         >
//                         <span className="svg-icon svg-text icon-margin">
//                             {button.icon}
//                         </span>
//                         {button.label}
//                         </button>
//                     ))}
//                     </div>
//                 </div>
//                 </div>
//             )}
//             </>
//         );
//         }
//         return (
//         <div className="th noselect d-inline-block">
//             <div
//             className="th-content d-flex justify-content-center"
//             onClick={e =>
//                 dataDispatch({
//                 columnId: 999999,
//                 focus: true,
//                 },{type: ActionTypes.ADD_COLUMN_TO_LEFT})
//             }
//             >
//             <span className="svg-icon-sm svg-gray">
//                 <PlusIcon />
//             </span>
//             </div>
//         </div>
//         );
//     }

//     useEffect(() => {
//         if (headerProps.created) {
//         setExpanded(true);
//         }
//     }, [headerProps.created]);

//     useEffect(() => {
//         setHeader(headerProps.label);
//     }, [headerProps.label]);

//     useEffect(() => {
//         if (inputRef) {
//         inputRef.focus();
//         inputRef.select();
//         }
//     }, [inputRef]);

//     return getHeader();
// }