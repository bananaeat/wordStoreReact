import React, { useEffect } from 'react';
import Sidebar from './Sidebar/Sidebar';
import WordList from './WordList/WordList';
import Menu from './Menu/Menu';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import {wordData} from './Sidebar/SidebarAddWord';
import { tagData } from './Sidebar/SidebarAddTag';
import { saveToLocal } from './StorageUtils/Utils';

export enum FieldType {
  Text = 'Text',
  Number = 'Number',
  Date = 'Date',
  Boolean = 'Boolean',
}

export type fieldData = { id:string, name: string, type: FieldType}


const WordDict: React.FC = () => {
  const [wordData, setWordData] = React.useState<wordData[]>([]);
  const [tagData, setTagData] = React.useState<tagData[]>([]);
  const [fieldData, setFieldData] = React.useState<fieldData[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);

  useEffect(() => {
    const loadData = () => {
      const loadedWordData = JSON.parse(localStorage.getItem('wordDict') ?? '[]');
      const loadedTagData = JSON.parse(localStorage.getItem('tagDict') ?? '[]');
      const loadedFieldData = JSON.parse(localStorage.getItem('fieldDict') ?? '[]');

      if (loadedWordData) {
        setWordData(loadedWordData);
      }
      if (loadedTagData) {
        setTagData(loadedTagData);
      }
      if (loadedFieldData) {
        setFieldData(loadedFieldData);
      }
    };

    loadData();
  }, []);

  const updateData = (key: string, newData: any) => {
    switch (key) {
      case 'wordDict':
        setWordData(newData);
        break;
      case 'tagDict':
        setTagData(newData);
        break;
      case 'fieldDict':
        setFieldData(newData);
        break;
      default:
        break;
    }
    saveToLocal(key, newData);
  };
  
  return (
    <div>
      <Menu wordData={wordData} tagData={tagData} setTagData={(data) => updateData('tagDict', data)} setWordData={(data) => updateData('wordDict', data)} setCurrentPage={setCurrentPage}/>
      <div className="WordDict columns m-0 mt-6">
        <Sidebar updateData={updateData} tagData={tagData} fieldData={fieldData}/>
        <WordList updateData={updateData} wordData={wordData} fieldData={fieldData} tagData={tagData} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
    </div>
    
  );
};

export default WordDict;