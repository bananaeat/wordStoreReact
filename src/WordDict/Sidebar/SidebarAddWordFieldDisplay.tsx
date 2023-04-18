import React from 'react';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FieldType, fieldData } from '../WordDict';
import { field } from '../WordList/WordList';

type Props = {
    f: fieldData;
    values: field[];
    setValues: (values: field[]) => void;
    onDeleteField: (id: string) => void;
}

const SidebarAddWordFieldDisplay = (props: Props) => {
    
    return (
        <div className="field">
        <label className="label is-small">{props.f.name}
            <i
                className="fas fa-delete-left m-1"
                aria-hidden="true"
                style={{cursor: 'pointer'}}
                onClick={() => {
                props.setValues(props.values.filter(v => v.name !== props.f.name));
                props.onDeleteField(props.f.id);
            }}></i>
        </label>

        <div className="control">
            {props.f.type === FieldType.Text && (<input
                className="input is-small"
                type="text"
                placeholder={props.f.name}
                id={props.f.name}
                value={props.values.find(v => v.name === props.f.name)
                ?.value}
                onChange={(event) => {
                props.setValues(props.values.map(v => v.name === props.f.name
                    ? {
                        ...v,
                        value: event.target.value
                    }
                    : v));
            }}/>)}
            {props.f.type === FieldType.Number && (<input
                className="input is-small"
                type="number"
                placeholder={props.f.name}
                id={props.f.name}
                value={props.values.find(v => v.name === props.f.name)
                ?.value}
                onChange={(event) => {
                props.setValues(props.values.map(v => v.name === props.f.name
                    ? {
                        ...v,
                        value: event.target.value
                    }
                    : v));
            }}/>)}
            {props.f.type === FieldType.Date && (<input
                className="input is-small"
                type="date"
                placeholder={props.f.name}
                id={props.f.name}
                value={props.values.find(v => v.name === props.f.name)
                ?.value}
                onChange={(event) => {
                props.setValues(props.values.map(v => v.name === props.f.name
                    ? {
                        ...v,
                        value: event.target.value
                    }
                    : v));
            }}/>)}
            {props.f.type === FieldType.Boolean && (
                <div className="select is-small">
                    <select
                        id={props.f.name}
                        value={props.values.find(v => v.name === props.f.name)
                        ?.value}
                        onChange={(event) => {
                        props.setValues(props.values.map(v => v.name === props.f.name
                            ? {
                                ...v,
                                value: event.target.value
                            }
                            : v));
                    }}>
                        <option value="true">是 True</option>
                        <option value="false">否 False</option>
                    </select>
                </div>
            )}
        </div>
    </div>)
}

export default SidebarAddWordFieldDisplay;