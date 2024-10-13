"use client";

import { useState, useEffect } from 'react';
import Borders from '@/Components/Game/Borders';
import CountryCard from '@/Components/Game/CountryCard';

export default function Game ({ gameMode, back_to_menu })
{
    const [ allCountries, setAllCountries ] = useState(null);
    const [ targetCountry, setTargetCountry ] = useState(null);
    const [ currentCountry, setCurrentCountry ] = useState(null);
    
    const [ cca3Map, setCca3Map ] = useState({});
    const [ countryGroupsMap, setCountryGroupsMap ] = useState({});

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

                let country_groups_map = {};
                // 0 (group1) => Europe; Asia; Africa; Oceania
                country_groups_map['0'] = json.filter(c => ['Europe', 'Asia', 'Africa', 'Oceania'].includes(c.continents[0])).map(c => c.cca3);
                // 1 (group2) => North America; South America
                country_groups_map['1'] = json.filter(c => ['North America', 'South America'].includes(c.continents[0])).map(c => c.cca3)

                // creates map: cca3 code -> index
                let cca3_map = {};
                json.forEach((country, index) => {
                    cca3_map[`${country.cca3}`] = index
                });

                setAllCountries(json);
                setCca3Map(cca3_map);
                setCountryGroupsMap(country_groups_map);
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
        if (!allCountries 
            || !Object.keys(cca3Map).length
            || !Object.keys(countryGroupsMap).length) {
            return;
        };

        // start the game
        setNewTargetCountry();

    }, [allCountries, cca3Map, countryGroupsMap]);

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

    function setNewTargetCountry ()
    {
        if (gameMode === 'easy') {
            let newTargetCountry = allCountries[getRandomIndex(allCountries.length)];
            setTargetCountry(newTargetCountry);
        } else if (gameMode === 'random')
        {
            let groupIndex = getRandomIndex(2)
            let group = countryGroupsMap[groupIndex];
            let targetCode = group[getRandomIndex(group.length)];
            let newTargetCountry = allCountries[cca3Map[targetCode]];
            newTargetCountry.group = groupIndex;
            setTargetCountry(newTargetCountry);
        };
    };

    function findSecondDegreeNeighbors (country)
    {
        // the function finds all countries that border the neighbors of the country passed as a parameter, but are not direct neighbors of that country
        let borderingCountries = []; 
        for (const neighborCode of country.borders) {
            borderingCountries.push(...allCountries[cca3Map[neighborCode]].borders);
        };
        return [...new Set(borderingCountries)].filter(code => !country.borders.includes(code) && code !== country.cca3);
    }

    function setNewCurrentCountry ()
    {
        if (gameMode === 'easy')
        {
            let neighborsCodes = findSecondDegreeNeighbors(targetCountry);
            if (!neighborsCodes.length) {
                setNewTargetCountry();
            };
            let neighborCode = neighborsCodes[getRandomIndex(neighborsCodes.length)];
            setCurrentCountry(allCountries[cca3Map[neighborCode]]);
        } else if (gameMode === 'random')
        {
            let neighbors = targetCountry.borders;
            let nonNeighbors = countryGroupsMap[targetCountry.group].filter(c => !neighbors.includes(c) && c !== targetCountry.cca3);
            let coutryCode = nonNeighbors[getRandomIndex(nonNeighbors.length)];
            setCurrentCountry(allCountries[cca3Map[coutryCode]]);
        };
    };


    // callbacks
    
    function get_country (code) {
        return allCountries[cca3Map[code]];
    }

    function on_click (code) {
        setCurrentCountry(allCountries[cca3Map[code]]);
    };

    return (
        <div className='w-full h-full flex flex-col justify-center items-center'>
            <button onClick={back_to_menu} className='absolute top-0 left-0 w-[150px] h-fit border rounded-full p-2 m-2 hover:bg-[#ffffff60] text-sm'>Back to menu</button>
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
                    <div className='h-2/5 overflow-auto'>
                        <h1 className='text-lg text-center py-2'>Where do you want to go?</h1>
                        <Borders borders={currentCountry?.borders} getCountry={get_country} onClick={on_click} />
                    </div>
                </>
            }
        </div>
    );
};