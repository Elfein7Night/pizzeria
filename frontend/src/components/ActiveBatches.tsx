import { useEffect, useState } from "react";
import { setGlobalState, useGlobalState } from "..";
import { IN_PROGRESS_BATCHES_URL, STATIONS } from "../App.constants";

type ActiveBatchesInfo = { [key: string]: { [station: string]: { [k: string]: any }[] } };

const isActiveBatchesInfoEmpty = (activeBatchesInfo: ActiveBatchesInfo) => {
    if (Object.keys(activeBatchesInfo).length === 0) return true;
    for (const key in activeBatchesInfo)
        for (const station in activeBatchesInfo[key])
            if (activeBatchesInfo[key][station].length)
                return false;
    return true;
}

const styles = {
    smallTable: {
        border: '1px solid black',
    }
}

const getTableForInfoObject = (infoObject: ActiveBatchesInfo, stage: string) => {
    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    {
                        STATIONS.map((station, i) =>
                            <th key={`th${i}`}>{station}</th>
                        )
                    }
                </tr>
            </thead>
            <tbody>
                <tr>
                    {
                        STATIONS.map((station, i) =>
                            <td key={`td${i}`}>{
                                infoObject[stage][station]
                                    .map((pizzaInfo, j) =>
                                        <table key={`table${j}`} style={styles.smallTable}><tbody>
                                            <tr key={`tr-pizzaId`}>
                                                <td><small>{`pizzaId: ${pizzaInfo['id']}`}</small></td>
                                            </tr>
                                            <tr key={`tr-batchId`}>
                                                <td><small>{`batchId: ${pizzaInfo['batchId']}`}</small></td>
                                            </tr>
                                            <tr key={`tr-toppingsAmount`}>
                                                <td><small>{`toppingsAmount: ${pizzaInfo['toppings'].length}`}</small></td>
                                            </tr>
                                        </tbody></table>
                                    )
                            }
                            </td>
                        )
                    }
                </tr>
            </tbody>
        </table >)
}

export default function ActiveBatches() {
    const [activeBatchesInfo, setActiveBatchesInfo] = useState<ActiveBatchesInfo>({});
    const [runFetchLoop, setRunFetchLoop] = useGlobalState("runFetchLoop");

    const fetchBatchesInProgress = async () => {
        console.log("fetching active batches...");
        const response = await fetch(IN_PROGRESS_BATCHES_URL);
        const data = await response.json();
        setActiveBatchesInfo(data);
        if (isActiveBatchesInfoEmpty(data)) {
            setGlobalState("runFetchLoop", false);
            setRunFetchLoop(false);
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (runFetchLoop) {
                fetchBatchesInProgress();
            }
        }, 1000);
        return () => clearInterval(interval);
    });

    return (
        isActiveBatchesInfoEmpty(activeBatchesInfo) ? <h6 style={{textAlign:'center', marginTop: '20px'}}>No batches in progress</h6> :
            <div>
                <h4 className="text-center">Station Queues</h4>
                {getTableForInfoObject(activeBatchesInfo, 'queues')}
                <h4 className="text-center">Stations</h4>
                {getTableForInfoObject(activeBatchesInfo, 'inStationInfo')}
            </div>
    );
}
