import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BG_COLOR, COMPLETE_BATCHES_URL } from '../App.constants';
import { prettyPrintJson } from 'pretty-print-json';

type Report = { [key: string]: any }[]

export default function CompletedBatches() {
    const [reports, setReports] = useState<Report>([]);

    const fetchCompleteBatches = async () => {
        console.log('fetching complete batches...');
        const response = await fetch(COMPLETE_BATCHES_URL);
        const data = await response.json();
        setReports(data);
    }

    useEffect(() => {
        fetchCompleteBatches();
    }, []);

    return (
        <div className='scrollable-div-long'>
            <Link to='/'>Go Back</Link>
            <br></br>
            <h1>Completed Batches Report</h1>
            {
                reports.length === 0 ? <h6 style={{ textAlign: 'center' }}>No completed batches found</h6> :
                    reports.map((report, i) =>
                        <div key={`div${i}`}>
                            <h6>{`Batch #${i + 1}`}</h6>
                            <pre id='reports' style={{ backgroundColor: BG_COLOR }} className='json-container' dangerouslySetInnerHTML={{ __html: prettyPrintJson.toHtml(report) }}></pre>
                        </div>
                    )
            }
        </div>
    );
}
