import { collection, doc, getDoc, getDocs, query } from "firebase/firestore"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { db } from "../../utils/firebase-config"
import { QUESTIONS_DATA } from "../../utils/questions-data"

const GuestList = () => {
    const router = useRouter()
    const eventId = router.query.id
    const [guests, setGuests] = useState([])
    const [eventQuestions, setEventQuestions] = useState([])
    const [countMap, setCountMap] = useState(new Map())

    const displayGuestName = (fullName) => {
        const name = fullName.split(' ')

        if (name.length > 2 && name[1] !== null) {
            return `${name[0]} ${name[1][0].toUpperCase()}.`
        } else {
            return name[0]
        }
    }

    const displayAnswersData = (answers) => {
        const answersArr = Object.values(answers)

        if (answersArr.length > 0) {
            return answersArr.map((response, id) => {
                const answer = String(response)
                
                if (answer === "true") {
                    return <td key={id}>yes</td>
                } else {
                    return <td key={id}>no</td>
                }
            })
        } else {
            return <td>no</td>
        }
    }

    useEffect(() => {
        const fetchFirestoreData = async () => {
            if (eventId) {
                const guestData = []
                const answersData = new Map()
                const answersCountData = new Map()
            
                const eventRef = doc(db, "events", String(eventId))
                const eventSnap = await getDoc(eventRef)
                
                const eventData = eventSnap.data()
                
                const q = query(collection(db, `events/${eventId}/guests`))
                const querySnapshot = await getDocs(q)

                querySnapshot.forEach((doc) => {
                    guestData.push({ id: doc.id, data: doc.data() })

                    for (const [id, answer] of Object.entries(doc.data().answers)) {
                        if (answersData.has(id)) {
                            const answersArray = answersData.get(id)
                            answersArray.push(answer)
                        } else {
                            answersData.set(id, [answer])
                        }
                    }

                    if (answersData.has("0")) {
                        const rsvpStatusArray = answersData.get("0")
                        rsvpStatusArray.push(doc.data().rsvpStatus)
                    } else {
                        answersData.set("0", [doc.data().rsvpStatus])
                    }
                })

                for (const [id, answers] of answersData) {
                    const count = {}

                    for (const element of answers) {
                        if (count[element]) {
                            count[element] += 1
                        } else {
                            count[element] = 1
                        }
                    }

                    answersCountData.set(id, Object.entries(count).map(entry => { return { name: entry[0], value: entry[1]  } }))
                }

                setGuests(guestData)
                setEventQuestions(eventData.questions.map(question => { return parseInt(question) }))
                setCountMap(answersCountData)
            }
        }

        fetchFirestoreData()
    }, [eventId])

    return (
        <div className="px-4">
            <main className="flex flex-col items-stretch px-2 py-6 h-screen gap-3">
                <div className="flex w-full items-center justify-between">
                    <button className="btn btn-secondary" onClick={() => router.back()}>
                        Go Back
                    </button>
                    <button className="btn btn-primary">
                        <Link
                            href={`/share-event/${encodeURIComponent(eventId)}`}>
                            View Event Page
                        </Link>
                    </button>
                </div>
                {
                    guests.length > 0 &&
                    <>
                        <div className="shadow-xl bg-neutral text-lg flex flex-col gap-1.5 w-full h-28 px-5 my-2 py-3">
                            <h3 className="text-primary font-bold uppercase">Guest Responses</h3>
                            {Array.from(countMap.keys()).map((key, id) => {
                                if (key === "0") {
                                    const attendingCount = countMap.get(key).find(element => element.name === "Attending")
                                    return (
                                        <div key={id} className="inline-flex gap-2 text-sm"><p>Attending Event: </p><p className="text-primary">{(attendingCount !== undefined ? attendingCount.value : 0 )}</p></div>
                                    )
                                } else if (key === "1") {
                                    const attendingCount = countMap.get(key).find(element => element.name === "Attending")
                                    return (
                                        <div key={id} className="inline-flex gap-2 text-sm"><p>Attending Pregame: </p><p className="text-primary">{(attendingCount !== undefined ? attendingCount.value : 0 )}</p></div>
                                    )
                                } else if (key === "2") {
                                    const attendingCount = countMap.get(key).find(element => element.name === "true")
                                    return (
                                        <div key={id} className="inline-flex gap-2 text-sm"><p>Bringing a +1: </p><p className="text-primary">{(attendingCount !== undefined ? attendingCount.value : 0 )}</p></div>
                                    )
                                } else if (key === "3") {
                                    const drinkingCount = countMap.get(key).find(element => element.name === "true")
                                    return (
                                        <div key={id} className="inline-flex gap-2 text-sm"><p>Will be drinking: </p><p className="text-primary">{(drinkingCount !== undefined ? drinkingCount.value : 0 )}</p></div>
                                    )
                                }
                            })}
                        </div>
                        <div className="overflow-x-auto">
                            <table className="table table-compact w-full">
                                <thead className="text-primary">
                                    <tr>
                                        <th>
                                            Name
                                        </th>
                                        <th>
                                            RSVP Status
                                        </th>
                                        {
                                            QUESTIONS_DATA.map((data, id) => {
                                                if (eventQuestions.indexOf(data.id) !== -1) {
                                                    return <th key={id}>
                                                        {data.columnName}
                                                    </th>
                                                }
                                            })
                                        }
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    { guests.map((guest, id) => {
                                            return (
                                                <tr key={id}>
                                                    <th>
                                                        {displayGuestName(guest.id)}
                                                    </th>
                                                    <td>
                                                        {guest.data.rsvpStatus}
                                                    </td>
                                                    {displayAnswersData(guest.data.answers)}
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </>
                }
                {
                    guests.length === 0 && <p className="text-center mt-10">
                        No guests to display yet!
                    </p>
                }
            </main>
        </div>
    )
}

export default GuestList