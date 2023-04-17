import React from 'react';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import {loadFromLocal} from '../StorageUtils/Utils';
import {wordData} from '../Sidebar/SidebarAddWord';
import {tagData} from '../Sidebar/SidebarAddTag';
import WordLine from './WordLine';
import WordListPagination from './WordListPagination';
import WordListAI from './WordListAI';
import { nanoid } from 'nanoid';

type Props = {
    updateData: (key : string, data: any) => void;
    wordData: wordData[];
    tagData: tagData[];
    currentPage: number;
    setCurrentPage: (page : number) => void;
}

export type Word = { word: string, definition: string, tags: tagData[] }

const WordList : React.FC < Props > = (props : Props) => {
    const [searchText,
        setSearchText] = React.useState('');

    const [AIModal,
        setAIModal] = React.useState(false);

    const currentPage = props.currentPage;
    const setCurrentPage = props.setCurrentPage;

    const maxPerPage = 15;

    const addWords = async (wordDict : Word[]) => {
        var words = loadFromLocal('wordDict');
        if (!words) {
            words = [];
        }
        words = words.concat(wordDict.map((word : Word) => {
            if (word.definition === '') {
                word.definition = 'Empty definition';
            }
            return {
                id: nanoid(),
                name: word.word,
                definition: word.definition,
                tags: word.tags
            };
        }));
        props.updateData('wordDict', words);
        setCurrentPage(1);
    }

    const onDeleteWord : (wordID : string) => Promise < boolean > = async(wordID) => {
        try {
            var wordDict = loadFromLocal('wordDict');
            if (!wordDict) {
                wordDict = [];
            }
            wordDict = wordDict.filter((word : wordData) => word.id !== wordID)
            props.updateData('wordDict', wordDict)
            if (currentPage > Math.ceil(wordDict.length / maxPerPage)) {
                setCurrentPage(Math.ceil(wordDict.length / maxPerPage))
            }
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    const onUpdateWord : (wordID : string, wordData : wordData) => Promise < boolean > = async(wordID, wordData) => {
        try {
            var wordDict = loadFromLocal('wordDict');
            if (!wordDict) {
                wordDict = [];
            }
            wordDict = wordDict.map((word : wordData) => {
                if (word.id === wordID) {
                    return wordData;
                }
                return word;
            })
            props.updateData('wordDict', wordDict)
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    return (
        <div
            className="WordList column is-two-thirds-desktop is-two-thirds-widescreen is-three-quarters-fullhd">
            <WordListAI AIModalVisible={AIModal} setAIModalVisible={setAIModal} addWords={addWords} tags={props.tagData}/>
            <div className="container">
                <div className="panel">
                    <p className="panel-heading">
                        <div className='is-flex is-justify-content-space-between'>
                            <span>
                                <i className="fa-solid fa-cat fa-bounce"></i>
                                词库
                            </span>
                            <span>
                                <i
                                    className="fa-solid fa-wand-magic-sparkles"
                                    style={{
                                    color: "#9e10ea"
                                }}
                                    onClick={() => setAIModal(true)}>AI工具</i>
                            </span>

                        </div>
                    </p>
                    <div className="panel-block">
                        <p className="control has-icons-left">
                            <input
                                className="input is-primary"
                                type="text"
                                placeholder="搜索"
                                onChange={(event) => {
                                setSearchText(event.target.value);
                                setCurrentPage(1);
                            }}/>
                            <span className="icon is-small is-left">
                                <i className="fas fa-search" aria-hidden="true"></i>
                            </span>
                        </p>
                    </div>
                    {props
                        .wordData
                        .filter((word : wordData) => {
                            return word
                                .name
                                .includes(searchText) || word
                                .definition
                                .includes(searchText) || word
                                .tags
                                .filter((tag : tagData) => {
                                    return tag
                                        .name
                                        .includes(searchText)
                                })
                                .length > 0;
                        })
                        .sort((a, b) => a.id.localeCompare(b.id))
                        .slice((currentPage - 1) * maxPerPage, currentPage * maxPerPage)
                        .map((word : wordData) => {
                            return <WordLine
                                key={word.id}
                                wordData={word}
                                onDelete={async() => {
                                await onDeleteWord(word.id)
                            }}
                                onUpdate={onUpdateWord}/>
                        })}
                </div>
            </div>
            <WordListPagination
                numberOfPages={Math.ceil(props.wordData.filter((word : wordData) => {
                return word
                    .name
                    .includes(searchText) || word
                    .definition
                    .includes(searchText) || word
                    .tags
                    .filter((tag : tagData) => {
                        return tag
                            .name
                            .includes(searchText)
                    })
                    .length > 0;
            }).length / maxPerPage)}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}/>
        </div>
    );
}

export default WordList;