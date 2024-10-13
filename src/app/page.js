"use client";

import { useState } from 'react';

import Game from "@/Components/Game/Game";

export default function Home()
{
  const [ gameMode, setGameMode ] = useState('');

  function back_to_menu () {
    setGameMode('');
  };

  return (
    <div className="h-screen w-screen">
      { gameMode 
      ? <Game back_to_menu={back_to_menu} gameMode={gameMode}/> 
      : 
      <div className='w-full h-full flex flex-col justify-center items-center gap-6'>
        <h1 className='w-full text-center text-xl'>Select difficulty level</h1>
        <div className='flex justify-center h-fit w-full gap-6'>
          <button className='w-[150px] h-fit border rounded-full p-2 hover:bg-[#ffffff60]' onClick={() => setGameMode('easy')} >easy</button>
          <button className='w-[150px] h-fit border rounded-full p-2 hover:bg-[#ffffff60]' onClick={() => setGameMode('random')} >random</button>
        </div>
      </div>
      }
    </div>
  );
}
