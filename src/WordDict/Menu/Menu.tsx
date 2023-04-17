import React from 'react';
import {wordData} from '../Sidebar/SidebarAddWord';
import {tagData} from '../Sidebar/SidebarAddTag';
import { loadFromLocal } from '../StorageUtils/Utils';

interface MenuItem {
    label : string;
    onClick : () => void;
}

type Props = {
    wordData: wordData[];
    setWordData: (data : wordData[]) => void;
    tagData: tagData[];
    setTagData: (data : tagData[]) => void;
    setCurrentPage: (page : number) => void;
}

export const Menu : React.FC < Props > = (props : Props) => {
    const [menuVisible,
        setMenuVisible] = React.useState(false);
    const menuItems : MenuItem[] = [
        {
            label: '保存到本地文件 Save to local file',
            onClick: async() => {
                const dataToSave = {
                    words: props.wordData,
                    tags: props.tagData
                };

                const fileData = JSON.stringify(dataToSave);
                const blob = new Blob([fileData], {type: "application/json;encoding=utf-8"});
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.download = "word_store.json";
                link.href = url;
                link.click();
            }
        }, {
            label: '读取本地文件 Read local file',
            onClick: async() => {
                // Upload local file
                const data = await new Promise < any > ((resolve, reject) => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.json';
                    input.onchange = (e) => {
                        const target = e.target as HTMLInputElement;
                        if (target && target.files) {
                            const file = target.files[0];
                            const reader = new FileReader();
                            reader.onload = (e) => {
                                const data = JSON.parse(e.target
                                    ?.result as string);
                                resolve(data);
                            };
                            reader.readAsText(file);
                        }
                    };
                    input.click();
                });
                if (data) {
                    const words = loadFromLocal('wordDict');
                    if (words) {
                        data.words = data.words.filter((word : wordData) => !words.find((w : wordData) => w.id === word.id)).concat(words);
                    }
                    props.setWordData(data.words);

                    const tags = loadFromLocal('tagDict');
                    if (tags) {
                        data.tags = data.tags.filter((tag : tagData) => !tags.find((t : tagData) => t.id === tag.id)).concat(tags);
                    }
                    props.setTagData(data.tags);
                    props.setCurrentPage(1);
                }
            }
        }
    ];

    return (
        <nav
            className="navbar is-info is-fixed-top"
            role="navigation"
            aria-label="main navigation">
            <div className="navbar-brand">
                <a
                    className="navbar-item"
                    href='https://github.com/bananaeat/WordStoreReact'
                    target="_blank">
                    <img src={require('../../icon_min.png')} alt="猫" width="32" height="32"/>
                    猫猫词库 Neko Word Store
                </a>
                <a
                    role="button"
                    className="navbar-burger"
                    aria-label="menu"
                    aria-expanded="false"
                    onClick={() => {
                    setMenuVisible(!menuVisible)
                }}
                    onBlur={() => setMenuVisible(false)}>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>
            <div
                className={`navbar-menu ${menuVisible
                ? 'is-active'
                : ''}`}>
                <div className="navbar-start">
                    {menuItems.map((item, index) => (
                        <a
                            key={index}
                            className="navbar-item"
                            onClick={(e) => {
                            e.preventDefault();
                            item.onClick();
                        }}>
                            {item.label}
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Menu;