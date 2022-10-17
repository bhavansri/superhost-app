const LocationCardDetails = ({ text, icon }) => (
    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(text)}`}>
    <div className="grid grid-cols-12 p-4 mt-2 font-medium rounded bg-gradient-to-r from-gray-200 to-gray-400 text-slate-900">
        <div className="">{icon}</div>
        <p className="col-span-11 underline">{text}</p>
    </div>
    </a>
)

export default LocationCardDetails