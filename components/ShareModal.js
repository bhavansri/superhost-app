import { XIcon } from "@heroicons/react/outline"
import Image from "next/image"
import celebrationImage from "../public/celebration.png"

const ShareModal = ({ showModal, showSpinner, setShowModal, onSharePress }) => {
    return (
        <div id="defaultModal" tabIndex="-1" className={`${ showModal ? "" : "hidden"} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full`}>
            <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
                <div className="relative bg-white rounded-lg shadow">
                    <div className="flex flex-col p-5">
                    <XIcon className="h-7 w-7 self-end text-primary-content" onClick={() => { setShowModal(false) }} />
                    <Image src={celebrationImage} alt="celebration" />
                    <p className="mt-5 text-primary-content">
                        Your event has been created! Click the share button to start
                        inviting your guests.
                    </p>
                    </div>
                    <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                        {showSpinner ?
                            <button className="btn loading">Loading</button> :
                            <button onClick={onSharePress} className="btn">
                                Share Event
                            </button>}
                    </div>
                </div>
            </div>
    </div>)
}

export default ShareModal