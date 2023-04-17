import React from 'react';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import {useState} from 'react';
import {nanoid} from 'nanoid';

export type tagData = {
    id: string;
    name: string;
    colour: string;
};

export type tagSaveResponse = boolean

const colourDict = [
    'primary',
    'info',
    'warning',
    'danger',
    'success',
    'link'
]

type Props = {
    onSave: (data : tagData) => Promise < tagSaveResponse >;
    closeModal: () => void;
}

const SidebarAddTag : React.FC < Props > = (props : Props) => {
    const [tag,
        setTag] = useState(""); // word
    const [colour,
        setColour] = useState(""); // definition
    const [tagWarning,
        setTagWarning] = useState(false); // word warning
    const [isDropdownOpen,
        setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const onWordBlur = () => {
        if (!tag) {
            setTagWarning(true);
        } else {
            setTagWarning(false);
        }
    };

    const onSave = async() => {
        if (!tag) {
            setTagWarning(true);
        } else {
            setTagWarning(false);
            await props.onSave({id: nanoid(), name: tag, colour});
        }
    };

    return (
        <div className="SidebarAddWord">
            <div className="has-background-light">
                <div className="container">
                    <div className="message">
                        <h1 className="message-header">创建新Tag (Create new tag)<button
                            className="delete"
                            aria-label="delete"
                            onClick={(e) => {
            e.preventDefault();
            props.closeModal();
        }}/></h1>
                        <div className="message-body">
                            <form id="add-tag-form">
                                <div className="field">
                                    <div className="label">Tag名称 Tag Name</div>
                                    <div className="control">
                                        <input
                                            className="input is-primary"
                                            type="text"
                                            placeholder="Tag"
                                            id="word"
                                            onChange={event => setTag(event.target.value)}
                                            onBlur={onWordBlur}/> {tagWarning && (
                                            <p className="help is-danger">未填写Tag名称 Tag name required</p>
                                        )}
                                    </div>
                                </div>

                                <div className="field">
                                    <label className="label">选择颜色 Choose Colour</label>
                                    <div className='control dropdown is-active'>
                                        <div className="dropdown-trigger">
                                            <button
                                                type="button"
                                                className="button"
                                                aria-haspopup="true"
                                                aria-controls="dropdown-menu2"
                                                onClick={toggleDropdown}>
                                                <span className={`tag m-1 is-${colour}`}>{tag !== ''
                                                        ? tag
                                                        : 'Tag'}</span>
                                                <span className="icon is-small">
                                                    <i className="fas fa-angle-down" aria-hidden="true"></i>
                                                </span>
                                            </button>
                                        </div>
                                        {isDropdownOpen && (
                                            <div className="dropdown-menu" id="dropdown-menu2" role="menu">
                                                <div className="dropdown-content">
                                                    {colourDict.map((colour) => {
                                                        return (
                                                            <a
                                                                href="#"
                                                                className={`tag is-${colour} m-1`}
                                                                key={colour}
                                                                onClick={event => {
                                                                event.preventDefault();
                                                                setColour(colour);
                                                                setIsDropdownOpen(false);
                                                            }}>
                                                                {colour}
                                                            </a>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="field is-grouped">
                                    <div className="control">
                                        <button
                                            disabled={tag === ''}
                                            className="button is-link"
                                            id="save-button"
                                            onClick={(event) => {
                                            event.preventDefault();
                                            onSave();
                                            props.closeModal();
                                        }}>创建 Create</button>
                                        <button
                                            className="button is-light"
                                            id="cancel-button"
                                            onClick={(event) => {
                                            event.preventDefault();
                                            props.closeModal();
                                        }}>取消 Cancel</button>
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

export default SidebarAddTag;