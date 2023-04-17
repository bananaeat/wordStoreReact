import React from 'react';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import {useState} from 'react';
import {nanoid} from 'nanoid';
import SidebarAddTag, {tagData, tagSaveResponse} from './SidebarAddTag';

export type wordData = {
    id: string;
    name: string;
    definition: string;
    tags: tagData[];
};

export type wordSaveResponse = boolean

type Props = {
    onSave: (data : wordData) => Promise < wordSaveResponse >;
    onDeleteTag: (tagID : string) => Promise < tagSaveResponse >;
    onSaveTag: (data : tagData) => Promise < tagSaveResponse >;
    tagData: tagData[];
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
            setWordSaveResponse(await props.onSave({id: nanoid(), name: word, definition, tags: selectedTags}));
        }
    };

    return (
        <div className="SidebarAddWord">
            <div className="has-background-light">
                <div className="container">
                    <div className="message">
                        <h1 className="message-header">添加词语</h1>
                        <div className="message-body">
                            <form id="add-word-form">
                                <div className="field">
                                    <label className="label">词语</label>
                                    <div className="control">
                                        <input
                                            className="input is-primary"
                                            type="text"
                                            placeholder="词语"
                                            id="word"
                                            onChange={event => setWord(event.target.value)}
                                            onBlur={onWordBlur}/> {wordWarning && (
                                            <p className="help is-danger">未填写词语名称。</p>
                                        )}
                                    </div>
                                </div>

                                <div className="field">
                                    <label className="label">定义</label>
                                    <div className="control">
                                        <input
                                            className="textarea is-info"
                                            type="text"
                                            placeholder="定义"
                                            id="definition"
                                            onChange={(event) => {
                                            setDefinition(event.target.value);
                                        }}/>
                                    </div>
                                </div>

                                <div className="field">
                                    <label className="label">Tag
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
                                    <div className={`modal ${tagAdding ? 'is-active' : ''}`} style={{
                                        overflow: 'visible',
                                    }}>
                                        <div className="modal-background"></div>
                                        <div className="modal-content" style={{
                                            overflow: 'visible',
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
                                                            className={`tag is-${tag
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

                                {wordWarning && (
                                    <article className="message is-danger">
                                        <div className="message-body">
                                            表格信息不完备。
                                        </div>
                                    </article>
                                )}

                                {wordSaveResponse && (
                                    <article className="message is-success">
                                        <div className="message-body">
                                            词语已保存。
                                        </div>
                                    </article>
                                )}

                                <div className="field is-grouped">
                                    <div className="control">
                                        <button
                                            disabled={word === ''}
                                            className="button is-link"
                                            id="save-button"
                                            onClick={(event) => {
                                            event.preventDefault();
                                            onSave();
                                        }}>保存</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SidebarAddWord;