import React from 'react';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import {useState} from 'react';
import {wordData} from '../Sidebar/SidebarAddWord';
import {tagData} from '../Sidebar/SidebarAddTag';

type Props = {
    wordData: wordData;
    allTags: tagData[];
    onDelete: () => Promise < void >;
    onUpdate: (id : string, data : wordData) => Promise < boolean >;
}

const WordLine : React.FC < Props > = (props : Props) => {
    const [isExpanded,
        setIsExpanded] = useState(false);

    const [isEditingName,
        setIsEditingName] = useState(false);

    const [isEditingDefinition,
        setIsEditingDefinition] = useState(false);

    const [editedDefinition,
        setEditedDefinition] = useState(props.wordData.definition);

    const [editedName,
        setEditedName] = useState(props.wordData.name);

    const [addingTags,
        setAddingTags] = useState(false);

    const [selectedTags, 
        setSelectedTags] = useState(props.wordData.tags);

    const [tags,
        setTags] = useState(props.wordData.tags);

    const handlePanelClick = () => {
        setIsExpanded(!isExpanded);
    };

    const WordLineAddTagModal = (
        <div
            className={`modal ${addingTags
            ? 'is-active'
            : ''}`}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">编辑Tags Edit Tags</p>
                    <button className="delete" aria-label="close" onClick={() => setAddingTags(false)}></button>
                </header>
                <section className="modal-card-body">
                    {props.allTags.map((tag) => {
                        return (
                            <span className={`tag ml-1 is-small is-${tag
                                .colour} ${selectedTags
                                .some((t : tagData) => t.id == tag.id)
                                ? ''
                                : 'is-light'}`}
                                onClick={
                                    () => {
                                        if (selectedTags.some((t : tagData) => t.id == tag.id)) {
                                            setSelectedTags(selectedTags.filter((t : tagData) => t.id != tag.id));
                                        } else {
                                            setSelectedTags([...selectedTags, tag]);
                                        }
                                    }
                                }>{tag.name}</span>
                        )
                    })}
                </section>
                <footer className="modal-card-foot">
                    <button className="button is-success" onClick={
                        async() => {
                            await props.onUpdate(props.wordData.id, {
                                ...props.wordData,
                                tags: selectedTags
                            });
                            setAddingTags(false);
                            setTags(selectedTags);
                        }
                    }>保存 Save</button>
                    <button className="button" onClick={() => {
                        setAddingTags(false);
                        setSelectedTags(props.wordData.tags);
                    }}>取消 Cancel</button>
                </footer>
            </div>
        </div>
    )

    return (
        <div>
            <div className="panel-block is-active ml-3 is-flex" onClick={handlePanelClick}>
                <span className="panel-icon">
                    <i className="fas fa-book" aria-hidden="true"></i>
                </span>
                <div
                    className="is-flex-shrink-0 is-flex-grow-1 has-text-weight-semibold wordName"
                    style={{
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    maxWidth: '90%'
                }}>
                    {!isEditingName
                        ? props.wordData.name
                        : (<input
                            className="input is-primary"
                            type="text"
                            value={editedName}
                            onClick={(e) => {
                            e.stopPropagation();
                        }}
                            onChange={(event) => {
                            setEditedName(event.target.value);
                        }}
                            onBlur={async() => {
                            await props.onUpdate(props.wordData.id, {
                                ...props.wordData,
                                name: editedName
                            });
                        }}/>)}
                </div>
                <div>
                    <span>
                        {props
                            .wordData
                            .tags
                            .map((tag) => {
                                return <span key={tag.id} className={`tag mx-1 is-${tag.colour}`}>{tag.name}</span>
                            })}
                    </span>
                </div>
                <span className="panel-icon ml-auto">
                    <i className="fas fa-plus-minus" aria-hidden="true" onClick={(e) => {
                        e.stopPropagation();
                        setAddingTags(true);
                    }}></i>
                </span>
                <span className="panel-icon">
                    <i
                        className={`fas fa-pen-to-square ${isEditingName
                        ? 'fa-beat-fade'
                        : ''}`}
                        aria-hidden="true"
                        onClick={(e) => {
                        e.stopPropagation();
                        setIsEditingName(!isEditingName);
                        setIsEditingDefinition(!isEditingDefinition);
                    }}></i>
                </span>
                <span className="panel-icon">
                    <i className="fas fa-delete-left" aria-hidden="true" onClick={props.onDelete}></i>
                </span>
            </div>
            <article
                className={`message additional-info`}
                style={{
                maxHeight: isExpanded
                    ? '200px'
                    : '0px',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease-in-out'
            }}>
                <div
                    className="message-body"
                    style={{
                    wordWrap: 'break-word'
                }}>
                    {!isEditingDefinition
                        ? props.wordData.definition
                        : (
                            <textarea
                                className="textarea is-primary"
                                value={editedDefinition}
                                onChange={(event) => {
                                setEditedDefinition(event.target.value);
                            }}
                                onBlur={async() => {
                                await props.onUpdate(props.wordData.id, {
                                    ...props.wordData,
                                    definition: editedDefinition
                                });
                            }}></textarea>
                        )}
                </div>
                {WordLineAddTagModal}
            </article>
        </div>
    );
}

export default WordLine;