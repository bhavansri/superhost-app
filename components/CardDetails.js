const CardDetails = ({ text, icon }) => (
    <div className="grid grid-cols-12 p-4 font-medium rounded bg-gradient-to-r from-gray-200 to-gray-400 text-slate-900">
      <div>{icon}</div>
      <p className="col-span-11 underline">{text}</p>
    </div>
)

export default CardDetails