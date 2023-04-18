import React from 'react';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import {useState} from 'react';
import {nanoid} from 'nanoid';
import { FieldType, fieldData } from '../WordDict';

type Props = {
    onSaveField: (data : fieldData) => Promise < boolean >;
    modalOpen: boolean;
    setModalOpen: (open: boolean) => void;
}

const SidebarAddField = (props: Props) => {
    const [fieldName, setFieldName] = useState("");
    const [fieldType, setFieldType] = useState(FieldType.Text);

    return (<div>
        <div className={`modal ${props.modalOpen ? 'is-active' : ''}`}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">添加字段 Add Field</p>
                    <button className="delete" aria-label="close" onClick={(e) => {e.preventDefault(); props.setModalOpen(false);}} ></button>
                </header>
                <section className="modal-card-body">
                    <div className="field">
                        <label className="label">字段名 Field Name</label>
                        <div className="control">
                            <input className="input" type="text" placeholder="字段名 Field Name" value={fieldName}
                            onChange={(e) => {setFieldName(e.target.value)}}/>
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">字段类型 Field Type</label>
                        <div className="control">
                            <div className="select">
                                <select value={fieldType} onChange={(e) => {setFieldType(e.currentTarget.value as FieldType)}}>
                                    <option value='Text'>文本 Text</option>
                                    <option value='Number'>数字 Number</option>
                                    <option value='Date'>日期 Date</option>
                                    <option value='Boolean'>布尔值 Boolean</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </section>
                <footer className="modal-card-foot">
                    <button className="button is-success" onClick={
                        (e) => {
                            e.preventDefault();
                            props.onSaveField({
                                id: nanoid(),
                                name: fieldName,
                                type: fieldType
                            }).then((success) => {
                                if (success) {
                                    setFieldName("");
                                    setFieldType(FieldType.Text);
                                    props.setModalOpen(false);
                                }
                            });
                        }
                    }>添加 Add</button>
                    <button className="button" onClick={
                        (e) => {
                            e.preventDefault();
                            setFieldName("");
                            setFieldType(FieldType.Text);
                            props.setModalOpen(false);
                        }
                    }>取消 Cancel</button>
                </footer>
            </div>
        </div>
    </div>);
}

export default SidebarAddField;