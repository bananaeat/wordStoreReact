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
                {[FieldType.Text, FieldType.Number, FieldType.Date].includes(field.type) && (<input
                    className="input is-primary"
                    type={field.type === FieldType.Number
                    ? 'number'
                    : field.type === FieldType.Date
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
                {field.type === FieldType.Boolean && (
                    <div className="select">
                        <select
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
                        }}>
                            <option value={"true"}>是 True</option>
                            <option value={"false"}>否 False</option>
                        </select>
                    </div>
                )
}
            </div>
        )
    } else {
        return (
            <div key={field.id}>
                <b>{field.name}</b>
                <span className='mx-1'>
                    <i
                        style={{
                        cursor: 'pointer',
                        color: 'red'
                    }}
                        className="fas fa-xmark fa-lg"
                        aria-hidden="true"
                        onClick={(e) => {
                        e.stopPropagation();
                        onUpdate(wordData.id, {
                            ...wordData,
                            fields: wordData.fields
                                ?.filter((v) => v.id !== field.id)
                        })
                    }}></i>
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
                </span>
                <br/>
                <div className='is-size-6'>{field.value}</div>
            </div>
        )
    }
}

export default WordLineFields;