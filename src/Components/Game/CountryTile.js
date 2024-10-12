import Image from "next/image";

export default function CountryTile ({ name, flagSrc, onClick })
{
    return (
        <div onClick={onClick} className="w-[150px] p-2">
            <Image
                className="h-[75px] w-[150px]"
                src={flagSrc}
                width={150}
                height={150}
                alt={name}
            />
            <h1 className="text-center truncate">{name}</h1>
        </div>
    )
}