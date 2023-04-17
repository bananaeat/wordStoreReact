import React from 'react';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import SidebarAddWord, {wordData, wordSaveResponse} from './SidebarAddWord';
import SidebarAddTag, {tagData, tagSaveResponse} from './SidebarAddTag';
import {loadFromLocal} from '../StorageUtils/Utils';

type Props = {
    updateData: (key : string, data : any) => void;
    tagData: tagData[];
}

const Sidebar : React.FC < Props > = (props : Props) => {
    const onSaveWord : (data : wordData) => Promise < wordSaveResponse > = async(wordData) => {
        try {
            var wordDict = loadFromLocal('wordDict');
            if (!wordDict) {
                wordDict = [];
            }
            if (wordData.definition === '') {
                wordData.definition = '暂无定义';
            }
            wordData.tags = wordData.tags.sort((a, b) => a.id.localeCompare(b.id));
            wordDict.push(wordData);
            props.updateData('wordDict', wordDict)
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    const onSaveTag : (data : tagData) => Promise < tagSaveResponse > = async(tagData) => {
        try {
            var tagDict = loadFromLocal('tagDict');
            if (!tagDict) {
                tagDict = [];
            }
            if (tagData.colour === '') {
                tagData.colour = 'primary';
            }
            tagDict.push(tagData);
            props.updateData('tagDict', tagDict)
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    const onDeleteTag : (tagID : string) => Promise < boolean > = async(tagID) => {
      try {
          var tagDict = loadFromLocal('tagDict');
          if (!tagDict) {
              tagDict = [];
          }
          tagDict = tagDict.filter((item: tagData) => item.id !== tagID);
          props.updateData('tagDict', tagDict)
          return true;
      } catch (error) {
          console.error('Error saving to localStorage:', error);
          return false;
      }
    }
        

    return (
        <div
            className="SideBar column is-one-third-desktop is-one-third-widescreen is-one-quarter-fullhd pt-auto">
            <SidebarAddWord
                onSave={async(wordData) => {
                return await onSaveWord(wordData);
            }}
                onDeleteTag={async(tagID) => {
                return await onDeleteTag(tagID);
            }}
                onSaveTag={async(tagData) => {
                return await onSaveTag(tagData);
            }}
                tagData={props.tagData}/>
        </div>
    );
};

export default Sidebar;