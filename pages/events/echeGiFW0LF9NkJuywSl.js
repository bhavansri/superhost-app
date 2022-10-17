import Head from 'next/head'

import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase-config'
import { SparklesIcon } from '@heroicons/react/outline'
import InvitationCard from '../../components/InvitationCard'
import { useRouter } from 'next/router'
import PlainTextCard from '../../components/PlainTextCard'

const Event = ({ event }) => {
  const router = useRouter()
  const eventID ='echeGiFW0LF9NkJuywSl'
  const GetDirectionsButton = () => (
    <a target={"_blank"} href="https://goo.gl/maps/99icEhda4RGzGpho8" rel="noreferrer">
    <button className="text-white btn btn-block btn-primary">
      <SparklesIcon className='w-5 h-5 mr-2' />
      Get Directions
    </button>
    </a>
  )

  return (
    <>
      <Head>
        <title>{event.eventTitle}</title>
        <meta name="description" content={event.location} />
        <link rel="icon" href="/superhost-icon.ico" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://app.usesuperhost.com/events/${eventID}`} key="ogurl" />
        <meta property="og:site_name" content="Superhost" key="ogsitename" />
        <meta property="og:title" content={event.eventTitle} key="ogtitle" />
        <meta property="og:description" content={event.location} key="ogdesc" />
      </Head>
      {
        event.type === 'portrait' && <InvitationCard title={event.eventTitle} imageURL={event.imageURL} location={event.location} startDate={event.startDate} endDate={event.endDate} primaryButton={<GetDirectionsButton />} isPortraitImage={true} />
      }
      {
        event.type === 'landscape' && <InvitationCard title={event.eventTitle} imageURL={event.imageURL} location={event.location} startDate={event.startDate} endDate={event.endDate} primaryButton={<GetDirectionsButton />} isPortraitImage={false} />
      }
      {
        event.type === 'plainText' && <PlainTextCard titlePos={JSON.parse(event.designProps.titlePos)} detailsPos={JSON.parse(event.designProps.detailsPos)} title={event.eventTitle} titleFont={event.designProps.titleFont} titleColor={event.designProps.titleColor} fontSize={event.designProps.fontSize} backgroundURL={event.cardBackground} startDate={event.startDate} endDate={event.endDate} location={event.location} onRSVP={onRSVPButtonPress} />
      }
    </>
  )
}

export async function getServerSideProps(context) {
  const eventID = "echeGiFW0LF9NkJuywSl"
  const eventRef = doc(db, "events", eventID)
  const eventSnap = await getDoc(eventRef)
  
  return {
    props: { eventID, event: eventSnap.exists() ? eventSnap.data() : null }
  }
}
  

export default Event