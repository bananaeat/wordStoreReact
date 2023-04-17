import React from 'react';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import WordListAIExtraction from './WordListAIExtraction';
import { Word } from './WordList';
import { tagData } from '../Sidebar/SidebarAddTag';

type Props = {
    setAIModalVisible: (visible : boolean) => void;
    addWords: (words: Word[]) => void;
    tags: tagData[];
    AIModalVisible: boolean
}

const WordListAI = (props : Props) => {
    return (
        <div
            className={`modal ${props.AIModalVisible
            ? 'is-active'
            : ''}`}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">AI关键词提取</p>
                    <button
                        className="delete"
                        aria-label="close"
                        onClick={() => props.setAIModalVisible(false)}></button>
                </header>
                <section className="modal-card-body">
                    <WordListAIExtraction hideModal={() => props.setAIModalVisible(false)} addWords={props.addWords} tags={props.tags}/>
                </section>
            </div>
        </div>
    );
}

export default WordListAI;