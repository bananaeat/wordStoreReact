import React, { useEffect } from 'react';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import {useState} from 'react';
import {nanoid} from 'nanoid';
import SidebarAddTag, {tagData, tagSaveResponse} from './SidebarAddTag';
import {field} from '../WordList/WordList';
import {FieldType, fieldData} from '../WordDict';
import SidebarAddField from './SidebarAddField';
import SidebarAddWordFieldDisplay from './SidebarAddWordFieldDisplay';

export type wordData = {
    id: string;
    name: string;
    definition: string;
    tags: tagData[];
    fields?: field[];
};

export type wordSaveResponse = boolean

type Props = {
    onSave: (data : wordData) => Promise < wordSaveResponse >;
    onDeleteTag: (tagID : string) => Promise < tagSaveResponse >;
    onSaveTag: (data : tagData) => Promise < tagSaveResponse >;
    onDeleteField: (fieldID : string) => Promise < boolean >;
    onSaveField: (data : fieldData) => Promise < boolean >;
    tagData: tagData[];
    fieldData: fieldData[];
}

const SidebarAddWord : React.FC < Props > = (props : Props) => {
    const [word,
        setWord] = useState(""); // word
    const [definition,
        setDefinition] = useState(""); // definition
    const [wordWarning,
        setWordWarning] = useState(false); // word warning
    const [wordSaveResponse,
        setWordSaveResponse] = useState(false); // word save response
    const [selectedTags,
        setSelectedTags] = useState < tagData[] > ([]);
    const [tagSetting,
        setTagSetting] = useState(false);
    const [tagAdding,
        setTagAdding] = useState(false);
    const [fieldAdding,
        setFieldAdding] = useState(false);
    const [fieldValue,
        setFieldValue] = useState < field[] > ([]);

    useEffect(() => {
        setFieldValue(props
        .fieldData
        .map((item : fieldData) => {
            return {...item, value: item.type === FieldType.Boolean ? 'false' : ''}
        }));
    }, [props.fieldData]);

    const onWordBlur = () => {
        if (!word) {
            setWordWarning(true);
        } else {
            setWordWarning(false);
        }
    };

    const onSave = async() => {
        if (!word) {
            setWordWarning(true);
        } else {
            setWordWarning(false);
            setWordSaveResponse(await props.onSave({id: nanoid(), name: word, definition, tags: selectedTags, 
                fields: fieldValue.filter((item : field) => item.value !== (item.type === FieldType.Boolean ? 'false' : ''))
            }));
            setInterval(() => {
                setWordSaveResponse(false);
            }, 3000);
            setWord("");
            setDefinition("");
            setFieldValue(fieldValue.map((item : field) => {
                return {...item, value: item.type === FieldType.Boolean ? 'false' : ''}
            }));
            setSelectedTags([]);
        }
    };

    return (
        <div className="SidebarAddWord">
            <div className="has-background-light">
                <div className="message is-small">
                    <h1 className="message-header">添加词语 Add Word</h1>
                    <div className="message-body padding-0-mobile">
                        <form id="add-word-form">
                            <div className="field">
                                <label className="label is-small">词语 Word</label>
                                <div className="control">
                                    <input
                                        className="input is-primary is-small"
                                        type="text"
                                        placeholder="词语"
                                        id="word"
                                        value={word}
                                        onChange={event => setWord(event.target.value)}
                                        onBlur={onWordBlur}/> {wordWarning && (
                                        <p className="help is-danger">未填写词语名称 Word name required</p>
                                    )}
                                </div>
                            </div>

                            <div className="field">
                                <label className="label is-small">定义 Definition</label>
                                <div className="control">
                                    <input
                                        className="input is-info is-small"
                                        type="text"
                                        placeholder="定义"
                                        id="definition"
                                        value={definition}
                                        onChange={(event) => {
                                        setDefinition(event.target.value);
                                    }}/>
                                </div>
                            </div>

                            <div className="field">
                                <label className="label is-small">Tag
                                    <i
                                        className={`fas fa-wrench m-1 ${tagSetting
                                        ? 'fa-beat-fade'
                                        : ''}`}
                                        aria-hidden="true"
                                        onClick={() => setTagSetting(!tagSetting)}></i>
                                    <i
                                        className={`fas fa-add m-1`}
                                        aria-hidden="true"
                                        onClick={() => setTagAdding(!tagAdding)}></i>
                                </label>
                                <div
                                    className={`modal ${tagAdding
                                    ? 'is-active'
                                    : ''}`}
                                    style={{
                                    overflow: 'visible'
                                }}>
                                    <div className="modal-background"></div>
                                    <div
                                        className="modal-content"
                                        style={{
                                        overflow: 'visible'
                                    }}><SidebarAddTag onSave={props.onSaveTag} closeModal={() => setTagAdding(false)}/></div>
                                    <button className="modal-close is-large" aria-label="close"></button>
                                </div>
                                <div className="field is-grouped is-grouped-multiline">
                                    {props
                                        .tagData
                                        .map((tag) => (
                                            <span className="control" key={tag.id}>
                                                <span
                                                    className={`tags has-addons m-1`}
                                                    onClick={() => {
                                                    if (selectedTags.some(t => t.id == tag.id)) {
                                                        setSelectedTags(selectedTags.filter((t) => t.id !== tag.id));
                                                    } else {
                                                        setSelectedTags([
                                                            ...selectedTags,
                                                            tag
                                                        ]);
                                                    }
                                                }}>
                                                    <span
                                                        className={`tag is-small is-${tag
                                                        .colour} ${selectedTags
                                                        .some(t => t.id == tag.id)
                                                        ? ''
                                                        : 'is-light'}`}>{tag.name}</span>
                                                    {tagSetting && (
                                                        <a
                                                            className="tag is-delete is-danger"
                                                            onClick={(event) => {
                                                            event.stopPropagation();
                                                            setSelectedTags(selectedTags.filter((t) => t.id !== tag.id));
                                                            props.onDeleteTag(tag.id);
                                                        }}></a>
                                                    )}
                                                </span>
                                            </span>
                                        ))}
                                </div>
                            </div>

                            <div>
                                <label className="label has-text-info">其他字段 Other Fields<i
                                    className={`fas fa-add m-1`}
                                    aria-hidden="true"
                                    style={{cursor: 'pointer'}}
                                    onClick={() => setFieldAdding(!fieldAdding)}></i>
                                </label>
                                <SidebarAddField
                                    modalOpen={fieldAdding}
                                    setModalOpen={setFieldAdding}
                                    onSaveField={async(f) => {
                                    setFieldValue([
                                        ...fieldValue, {
                                            id: nanoid(),
                                            name: f.name,
                                            type: f.type,
                                            value: null
                                        }
                                    ]);
                                    return await props.onSaveField(f);
                                }}/>
                            </div>

                            {props
                                .fieldData
                                .map((f) => (
                                    <SidebarAddWordFieldDisplay key={f.id} f={f} values={fieldValue} setValues={setFieldValue} onDeleteField={props.onDeleteField}/>
                                ))}

                            {wordWarning && (
                                <article className="message is-danger is-small">
                                    <div className="message-body">
                                        表格信息不完备。Form not complete.
                                    </div>
                                </article>
                            )}

                            {wordSaveResponse && (
                                <article className="message is-success is-small">
                                    <div className="message-body">
                                        词语已保存。Word saved.
                                    </div>
                                </article>
                            )}

                            <div className="field is-grouped">
                                <div className="control">
                                    <button
                                        disabled={word === ''}
                                        className="button is-link is-small"
                                        id="save-button"
                                        onClick={(event) => {
                                        event.preventDefault();
                                        onSave();
                                    }}>保存 Save</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SidebarAddWord;