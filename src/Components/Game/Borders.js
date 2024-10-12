import CountryTile from "@/Components/Game/CountryTile";

export default function Borders ({ borders, getCountry, onClick })
{
    return (
        <div className="flex flex-row flex-wrap items-center justify-center">
            {borders?.map((code) => {
                let country = getCountry(code);
                return <CountryTile onClick={() => onClick(code)} key={country.cca3} name={country.name.common} flagSrc={country.flags.png} />
            })}
        </div>
    );
};