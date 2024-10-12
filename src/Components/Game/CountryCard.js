import Image from "next/image";

export default function CountryCard ({ country })
{
    return (
        <div className="w-fit">
            <Image
                className="h-[150px] w-[300px]"
                src={country.flags.png}
                width={300}
                height={300}
                alt={country.name.common}
            />
            <h1 className="text-center">{country.name.common}</h1>
        </div>
    );
};