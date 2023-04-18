import React from 'react';
import {wordData} from '../Sidebar/SidebarAddWord';
import {tagData} from '../Sidebar/SidebarAddTag';
import {loadFromLocal} from '../StorageUtils/Utils';
import ReactMarkdown from 'react-markdown'
import { fieldData } from '../WordDict';

interface MenuItem {
    label : string;
    onClick : () => void;
}

type Props = {
    wordData: wordData[];
    setWordData: (data : wordData[]) => void;
    tagData: tagData[];
    setTagData: (data : tagData[]) => void;
    fieldData: fieldData[];
    setFieldData: (data : fieldData[]) => void;
    setCurrentPage: (page : number) => void;
}

export const Menu : React.FC < Props > = (props : Props) => {
    const [menuVisible,
        setMenuVisible] = React.useState(false);

    const [aboutVisible,
        setAboutVisible] = React.useState(false);

    const menuItems : MenuItem[] = [
        {
            label: '保存到本地文件 Save to local file',
            onClick: async() => {
                const dataToSave = {
                    words: props.wordData,
                    tags: props.tagData,
                    fields: props.fieldData
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
                        data.words = data
                            .words
                            .filter((word : wordData) => !words.find((w : wordData) => w.id === word.id))
                            .concat(words);
                    }
                    props.setWordData(data.words);

                    const tags = loadFromLocal('tagDict');
                    if (tags) {
                        data.tags = data
                            .tags
                            .filter((tag : tagData) => !tags.find((t : tagData) => t.id === tag.id))
                            .concat(tags);
                    }
                    props.setTagData(data.tags);

                    const fields = loadFromLocal('fieldDict');
                    if (fields) {
                        data.fields = data
                            .fields
                            .filter((field : fieldData) => !fields.find((f : fieldData) => f.id === field.id))
                            .concat(fields);
                    }
                    props.setFieldData(data.fields);
                    props.setCurrentPage(1);
                }
            }
        }, {
            label: '帮我买猫粮 Buy me catfood',
            onClick: async() => {
                window.open('https://www.patreon.com/CausalityZ', '_blank');
            }
        }, {
            label: '关于/帮助 About/Help',
            onClick: async() => {
                setAboutVisible(true);
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
            <div
                className={`modal ${aboutVisible
                ? 'is-active'
                : ''}`}>
                <div className="modal-background"></div>
                <div className="modal-card">
                    <header className="modal-card-head has-background-black">
                        <p className="modal-card-title has-text-white">猫猫词库 Word Store v1.0.0</p>
                        <button
                            className="delete"
                            aria-label="close"
                            onClick={() => setAboutVisible(false)}></button>
                    </header>
                    <section className="modal-card-body has-text-black markdown">
                        <img src={require('../../banner.png')} alt="猫猫词库" style={{display: 'inline-block', width: '100%'}}/>
                        <ReactMarkdown>{`
## 关于 猫猫词库 / Word Store

*by [Causality_Z](https://okjk.co/XH0sGt)*

# 简介

猫猫词库是一个词汇管理工具，可以帮助用户管理和查询专业词汇，同时提供词汇提取和释义功能。

# 功能介绍

* 词汇存储和查询：用户可以自定义创建专业词汇的词条/对应释意/内容说明，并设定Tag分类领域/属性，词条内容支持搜索查询；
* 语段专业名词提取和释义：用户提供API后，可以使用「AI Tools」工具输入任意语段，此应用可自动提取该语段中包含的专有名词，并为所有名词建立翻译/自动释意词条/标记已有Tag；
* 从文件读取词语列表：支持json格式保存； -支持移动设备和PC网页端，不同设备词汇暂时不互通。

# 使用方法

* 添加词语：点击「添加词语」按钮，输入词条名称、释义、点击相关Tag，点击「保存」按钮，即可创建词条；
* 词语智能提取：点击「AI Tools」按钮，输入API key和语段，点击「提交」按钮，即可提取语段中的专业名词；
* 文件操作：点击「保存到本地」按钮可下载json文件;点击「读取本地文件」按钮，选择本地json文件，即可导入词汇列表。
* Tag 管理：点击添加词语->Tag的「+」按钮，可添加Tag；点击「扳手」按钮，可以删除Tag。
                            `}
                        </ReactMarkdown>
                    </section>
                </div>
            </div>
        </nav>
    );
};

export default Menu;