import React from 'react';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import {Word} from './WordList';
import {load} from 'dotenv';
import {tagData} from '../Sidebar/SidebarAddTag';
const {Configuration, OpenAIApi} = require("openai");

type Props = {
    hideModal: () => void;
    addWords: (words : Word[]) => void;
    tags: tagData[];
}

const wordExtraction = async(text : string, openai_key : string, translationMode : string, tags : tagData[]) => {
    const generatePrompt = {
        'English': `The user will send you a piece of text. You need to identify proper nouns or important conceptual vocabulary from it, and list them with their definitions. Definitions should be brief, ideally within one sentence. The format you list must be one word per line, with the word and its definition separated by a hyphen. For example:

        Economics-The social science studying the relationships between goods and services
        Mathematics-The study of numbers and abstract concepts
    
        Do not output any other content.`,
        '中文': `用户将向您发送一段文本。您需要从其中识别出名词或重要的概念性词汇，并将其与其定义一起列出。定义应该简洁，理想情况下应该在一句话内。您列出的格式必须是每行一个单词，单词与其定义之间用hyphen分隔。例如：

        经济学-研究商品和服务之间关系的社会科学
        数学-研究数字和抽象概念的学科

        将释义翻译成中文，但不要翻译单词本身。
    
        不要输出其他内容。`
    }

    const taggingPrompt = {
        'English': `The user will send you a list of words, corresponding definitions, and a list of tags. For each word, give them appropriate tags. 
        The format you list must be one word per line, with the word and its tags separated by a hyphen, and tags separated by comma. For example:

        User Input:
            Text:
            Economics-The social science studying the relationships between goods and services
            Mathematics-The study of numbers and abstract concepts
            Tags:
            Subject, Social Science, Science

        Your Output:
            Economics-Subject, Social Science
            Mathematics-Subject, Science
        
        If no tags are appropriate, omit the word from your output.
        Do not output any other content.`,
        '中文': `用户将向您发送一组单词，对应的定义和标签列表。对于每个单词，给出适当的标签。
        您列出的格式必须是每行一个单词，单词与其标签之间用hyphen分隔，标签用逗号分隔。例如：

        用户输入：
            Text:
            经济学-研究商品和服务之间关系的社会科学
            数学-研究数字和抽象概念的学科
            Tags:
            学科, 社会科学, 科学

        您的输出：
            经济学-学科, 社会科学
            数学-学科, 科学
        
        如果没有适当的标签，请从您的输出中省略单词。
        不要输出其他内容。`
    }

    var dataString = ""

    try {
        const configuration = new Configuration({apiKey: openai_key});
        delete configuration.baseOptions.headers['User-Agent'];
        const openai = new OpenAIApi(configuration);

        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: generatePrompt[translationMode as keyof typeof generatePrompt]
                }, {
                    role: "user",
                    content: text
                }
            ]
        });
        dataString = completion.data.choices[0].message.content
    } catch (error) {
        console.error('Error fetching data:', error);
    }

    const data = dataString
        .split('\n')
        .filter((line : string) => line.includes('-'))
        .map((line : string) => {
            const [word,
                definition] = line.split('-');
            return {word, definition}
        });

    console.log(data)

    var taggingString = ""
    var taggingData : any = []

    if (tags.length > 0) {
        try {
            const configuration = new Configuration({apiKey: openai_key});
            delete configuration.baseOptions.headers['User-Agent'];
            const openai = new OpenAIApi(configuration);

            const completion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: taggingPrompt[translationMode as keyof typeof taggingPrompt]
                    }, {
                        role: "user",
                        content: `Text:
                                    ${dataString}
                                  Tags:
                                    ${tags
                            .map(tag => tag.name)
                            .join(', ')}`
                    }
                ]
            });
            taggingString = completion.data.choices[0].message.content
        } catch (error) {
            console.error('Error fetching data:', error);
        }

        taggingData = taggingString
            .split('\n')
            .filter((line : string) => line.includes('-'))
            .map((line : string) => {
                const [word,
                    tag] = line.split('-');
                const tagList = tag
                    .split(',')
                    .map((tag : string) => tag.trim());
                var tagList2 : tagData[] = []
                tagList.forEach(tagName => {
                    tags
                        .filter(tag => tag.name === tagName)
                        .forEach(tag => tagList2.push(tag))
                })
                return {word: word, tagList: tagList2}
            });
    }

    console.log(taggingData)

    const returnData = taggingData.length == 0
        ? data.map((word : any) => {
            return {word: word.word, definition: word.definition, tags: []}
        })
        : data.map((word : any) => {
            const tagList = taggingData.filter((tag : any) => tag.word === word.word).map((tag : any) => tag.tagList)[0] || [];
            return {word: word.word, definition: word.definition, tags: tagList}
        })

    console.log(returnData)

    return returnData as Word[];
}

const WordListAIExtraction = (props : Props) => {
    const [text,
        setText] = React.useState('');

    const [openaiKey,
        setOpenAIKey] = React.useState('');

    const [loading,
        setLoading] = React.useState(false);

    const [translationMode,
        setTranslationMode] = React.useState('English');

    const onSubmit = async() => {
        setLoading(true);
        const words = await wordExtraction(text, openaiKey, translationMode, props.tags);
        await props.addWords(words);
        setLoading(false);
        props.hideModal();
    }

    return (
        <div>
            <div className="field">
                <label className="label">OpenAI API Key <i className="fas fa-key"></i></label>
                <div className="control">
                    <input
                        className="input"
                        type="text"
                        placeholder="sk-xxx"
                        value={openaiKey}
                        onChange={(e) => setOpenAIKey(e.target.value)}/>
                </div>
            </div>

            <div className="field">
                <label className="label">文本内容</label>
                <div className="control">
                    <textarea
                        className="textarea"
                        placeholder="Text input"
                        value={text}
                        onChange={(event) => setText(event.target.value)}/>
                </div>
            </div>

            {/* 翻译模式 */}
            <div className='field'>
                <label className='label'>翻译模式</label>
                <div className='control'>
                    <div className='select'>
                        <select onChange={(e) => setTranslationMode(e.currentTarget.value)}>
                            <option>中文</option>
                            <option>English</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="field is-grouped">
                <div className="control">
                    <button
                        className={`button is-link ${loading
                        ? 'is-loading'
                        : ''}`}
                        onClick={onSubmit}>提交</button>
                </div>
                <div className="control">
                    <button className="button is-link is-light" onClick={props.hideModal}>取消</button>
                </div>
            </div>
        </div>
    )
}

export default WordListAIExtraction;