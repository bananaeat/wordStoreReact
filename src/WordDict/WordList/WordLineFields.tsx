import React from 'react';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import {field} from './WordList';
import {wordData} from '../Sidebar/SidebarAddWord';
import {FieldType, fieldData} from '../WordDict';

type Props = {
    isEditingField: {
        id: string;
        editing: boolean;
    }[];
    setIsEditingField: (isEditingField : {
        id: string;
        editing: boolean;
    }[]) => void;
    editedFields: field[];
    setEditedFields: (editedFields : field[]) => void;
    field: field;
    wordData: wordData;
    fieldData: fieldData[];
    onUpdate: (id : string, data : any) => Promise < boolean >;
}

const WordLineFields = (props : Props) => {
    const isEditingField = props.isEditingField;
    const setIsEditingField = props.setIsEditingField;
    const editedFields = props.editedFields;
    const setEditedFields = props.setEditedFields;
    const field = props.field;
    const wordData = props.wordData;
    const onUpdate = props.onUpdate;

    if (isEditingField.some((v) => v.id === field.id && v.editing)) {
        return (
            <div key={field.id} className='control'>
                <label className="label">{field.name}
                    <span>
                        <i
                            style={{
                            cursor: 'pointer'
                        }}
                            className="fas fa-floppy-disk"
                            aria-hidden="true"
                            onClick={async() => {
                            await props.onUpdate(props.wordData.id, {
                                ...props.wordData,
                                fields: props.wordData.fields
                                    ?.map((v) => {
                                        if (v.id === field.id) {
                                            return {
                                                ...v,
                                                value: editedFields.find((f) => f.id === field.id)
                                                    ?.value
                                            }
                                        }
                                        return v;
                                    })
                            });
                            setIsEditingField(isEditingField.map((v) => {
                                if (v.id === field.id) {
                                    return {
                                        ...v,
                                        editing: false
                                    }
                                }
                                return v;
                            }))
                        }}></i>
                    </span>
                </label>
                {[FieldType.Text, FieldType.Number, FieldType.Date].includes(props.fieldData.find((v) => v.id === field.id)
                    ?.type as FieldType) && (<input
                        className="input is-primary"
                        type={props
                        .fieldData
                        .find((v) => v.id === field.id)
                        ?.type === FieldType.Number
                            ? 'number'
                            : props
                                .fieldData
                                .find((v) => v.id === field.id)
                                ?.type === FieldType.Date
                                    ? 'date'
                                    : 'text'}
                        value={editedFields.find((f) => f.id === field.id)
                        ?.value}
                        onClick={(e) => {
                        e.stopPropagation();
                    }}
                        onChange={(event) => {
                        setEditedFields(editedFields.map((v) => {
                            if (v.id === field.id) {
                                return {
                                    ...v,
                                    value: event.target.value
                                }
                            }
                            return v;
                        }))
                    }}
                        onBlur={async() => {
                        await props.onUpdate(props.wordData.id, {
                            ...props.wordData,
                            fields: props.wordData.fields
                                ?.map((v) => {
                                    if (v.id === field.id) {
                                        return {
                                            ...v,
                                            value: editedFields.find((f) => f.id === field.id)
                                                ?.value
                                        }
                                    }
                                    return v;
                                })
                        });
                        setIsEditingField(isEditingField.map((v) => {
                            if (v.id === field.id) {
                                return {
                                    ...v,
                                    editing: false
                                }
                            }
                            return v;
                        }))
                    }}/>)
}
            </div>
        )
    } else {
        return (
            <div key={field.id}>
                <i
                    style={{
                    cursor: 'pointer',
                    color: 'red'
                }}
                    className="fas fa-xmark"
                    aria-hidden="true"
                    onClick={(e) => {
                    e.stopPropagation();
                    onUpdate(wordData.id, {
                        ...wordData,
                        fields: wordData.fields
                            ?.filter((v) => v.id !== field.id)
                    })
                }}></i>
                <b className='is-size-7'>{field.name}
                    -
                    <span className="ml-auto">
                        <i
                            style={{
                            cursor: 'pointer'
                        }}
                            className="fas fa-pen"
                            aria-hidden="true"
                            onClick={(e) => {
                            e.stopPropagation();
                            setIsEditingField(isEditingField.map((v) => {
                                if (v.id === field.id) {
                                    return {
                                        ...v,
                                        editing: true
                                    }
                                }
                                return {
                                    ...v,
                                    editing: false
                                };
                            }))
                        }}></i>
                    </span>{field.value}</b>
            </div>
        )
    }
}

export default WordLineFields;