import React, { useEffect } from 'react';
import Sidebar from './Sidebar/Sidebar';
import WordList from './WordList/WordList';
import Menu from './Menu/Menu';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import {wordData} from './Sidebar/SidebarAddWord';
import { tagData } from './Sidebar/SidebarAddTag';
import { saveToLocal } from './StorageUtils/Utils';


const WordDict: React.FC = () => {
  const [wordData, setWordData] = React.useState<wordData[]>([]);
  const [tagData, setTagData] = React.useState<tagData[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);

  useEffect(() => {
    const loadData = () => {
      const loadedWordData = JSON.parse(localStorage.getItem('wordDict') ?? '[]');
      const loadedTagData = JSON.parse(localStorage.getItem('tagDict') ?? '[]');

      if (loadedWordData) {
        setWordData(loadedWordData);
      }
      if (loadedTagData) {
        setTagData(loadedTagData);
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
      default:
        break;
    }
    saveToLocal(key, newData);
  };
  
  return (
    <div>
      <Menu wordData={wordData} tagData={tagData} setTagData={(data) => updateData('tagDict', data)} setWordData={(data) => updateData('wordDict', data)} setCurrentPage={setCurrentPage}/>
      <div className="WordDict columns m-5 mt-6">
        <Sidebar updateData={updateData} tagData={tagData}/>
        <WordList updateData={updateData} wordData={wordData} tagData={tagData} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
    </div>
    
  );
};

export default WordDict;