import React from 'react';
import {wordData} from '../Sidebar/SidebarAddWord';
import {tagData} from '../Sidebar/SidebarAddTag';
import icon from '../../icon_min.png'

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
    const menuItems : MenuItem[] = [
        {
            label: '保存到本地文件',
            onClick: async() => {
                const dataToSave = {
                    words: props.wordData,
                    tags: props.tagData
                };

                const fileData = JSON.stringify(dataToSave);
                const blob = new Blob([fileData], {type: "application/json;encoding=utf-8"});
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.download = "user-info.json";
                link.href = url;
                link.click();
            }
        }, {
            label: '读取本地文件',
            onClick: async() => {
                const data = {
                    words: [],
                    tags: []
                }
                if (data) {
                    props.setWordData(data.words);
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
            <div className="navbar-menu">
                <div className="navbar-start">
                    <a
                        className="navbar-item"
                        href='https://github.com/bananaeat/WordStore'
                        target="_blank">
                        <img src={icon} alt="猫" width="32" height="32"/>
                        猫猫词库
                    </a>
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