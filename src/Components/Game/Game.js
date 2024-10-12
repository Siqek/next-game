"use client";

import { useState, useEffect } from 'react';
import Borders from '@/Components/Game/Borders';
import CountryCard from '@/Components/Game/CountryCard';

export default function Game ()
{
    const [ allCountries, setAllCountries ] = useState(null);
    const [ targetCountry, setTargetCountry ] = useState(null);
    const [ currentCountry, setCurrentCountry ] = useState(null);
    
    const [ cca3Map, setCca3Map ] = useState({});

    const [ score, setScore ] = useState(0);

    const [ error, setError ] = useState(false);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await fetch('https://restcountries.com/v3.1/all');
                let json = await res.json();

                // filters out countries without borders
                json = json.filter(country => country.borders);
                // filters out countries such as the UK and Ireland, which only share a border with each other
                json = json.filter(c => !(c.borders.length === 1 && json.find(c2 => c2.cca3 === c.borders[0]).borders.length === 1));
                console.log(json);
                
                // creates map: cca3 code -> index
                let cca3_map = {};
                json.forEach((country, index) => {
                    cca3_map[`${country.cca3}`] = index
                });

                setAllCountries(json);
                setCca3Map(cca3_map);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            };
        };
        getData();
    }, []);

    useEffect(() => {
        if (!allCountries || !Object.keys(cca3Map).length)
            return;

        // start the game
        setNewTargetCountry();

    }, [allCountries, cca3Map]);

    useEffect(() => {
        if (targetCountry)
            setNewCurrentCountry();
    }, [targetCountry]);

    useEffect(() => {
        if (!currentCountry)
            return;

        if (currentCountry === targetCountry)
            setScore(prev => prev + 1);

    }, [currentCountry]);

    useEffect(() => {
        if (score)
            setNewTargetCountry();
    }, [score]);

    function getRandomIndex (numOfElements) {
        return Math.floor(Math.random() * numOfElements);
    };

    function setNewTargetCountry () {
        let newTargetCountry = allCountries[getRandomIndex(allCountries.length)];
        setTargetCountry(newTargetCountry);
    };

    function findSecondDegreeNeighbors (country)
    {
        // the function finds all countries that border the neighbors of the country passed as a parameter, but are not direct neighbors of that country
        let borderingCountries = []; 
        for (const neighborCode of country.borders) {
            borderingCountries.push(...allCountries[cca3Map[neighborCode]].borders);
        };
        borderingCountries = [...new Set(borderingCountries)].filter(code => !country.borders.includes(code) && code !== country.cca3);

        console.log(borderingCountries);
        return borderingCountries;
    }

    function setNewCurrentCountry ()
    {
        let neighborsCodes = findSecondDegreeNeighbors(targetCountry);
        if (!neighborsCodes.length) {
            setNewTargetCountry();
        };
        let neighborCode = neighborsCodes[getRandomIndex(neighborsCodes.length)];
        setCurrentCountry(allCountries[cca3Map[neighborCode]]);
    };


    // callbacks
    
    function _getCountry (code) {
        return allCountries[cca3Map[code]];
    }

    function _onClick (code) {
        setCurrentCountry(allCountries[cca3Map[code]]);
    };

    return (
        <div className='w-full h-full flex flex-col justify-center items-center'>
            {error && <h1>Nie udało się pobrać danych</h1>}
            {loading && <h1>Pobieranie danych....</h1>}
            {currentCountry && targetCountry &&
                <>
                    <h1 className='text-2xl h-1/6 flex items-center justify-center'>Your score: {score}</h1>
                    <div className='flex flex-row items-center justify-evenly w-full h-1/3'>
                        <div className='w-fit'>
                            <h1 className='text-center text-lg py-2'>You are here:</h1>
                            <CountryCard country={currentCountry} />
                        </div>
                        <div>
                            <h1 className='text-center text-lg py-2'>Your destination:</h1>
                            <CountryCard country={targetCountry} />
                        </div>
                    </div>
                    <Borders borders={currentCountry?.borders} getCountry={_getCountry} onClick={_onClick} />
                </>
            }
        </div>
    );
};