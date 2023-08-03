import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/_utils/options'

import Header from "./_components/Header"
import Status from "./_components/Status"
import Form from "./_components/Form"
import Application from "./_components/Application"
import Info from "./_components/Info"

import { AnnouncementsList } from "@/app/_template_data/Announcements"


const getData = async () => {
    const session = await getServerSession(authOptions)
    const email = encodeURIComponent(session?.user?.email || "")

    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/airtable?email=${email}`)   
    const data = await res.json()

    console.log("This is the data: ", data)

    return data.body
}


export default async function Dashboard() {
    const airtableRecord = await getData()

    console.log(airtableRecord)

    return (
        <div className='page space'>
            <div className="w-[90%]">
                <Header />
                {airtableRecord ?
                    <>
                        <Status accepted={airtableRecord['Accepted']} />
                        {airtableRecord['Accepted'] && 
                            <Info data={AnnouncementsList} />
                        }
                        <Application application={airtableRecord} />
                    </>
                    :
                    <Form />
                }
            </div>
        </div>
    )
}
