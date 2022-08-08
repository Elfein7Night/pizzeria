import { useEffect, useState } from "react";
import { setGlobalState, useGlobalState } from "..";
import { IN_PROGRESS_BATCHES_URL, STATIONS } from "../App.constants";

type ActiveBatchesInfo = { [key: string]: { [station: string]: { [k: string]: any }[] } };

const isActiveBatchesInfoEmpty = (activeBatchesInfo: ActiveBatchesInfo) => {
    if (Object.keys(activeBatchesInfo).length === 0) return true;
    for (const key in activeBatchesInfo)
        if (activeBatchesInfo.hasOwnProperty(key))
            for (const station in activeBatchesInfo[key])
                if (activeBatchesInfo[key].hasOwnProperty(station))
                    if (activeBatchesInfo[key][station].length)
                        return false;
    return true;
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
                                        <table ><tbody>
                                            <tr key={`tr${j}`}>
                                                <td><small>{`pizzaId: ${pizzaInfo['id']}`}</small></td>
                                            </tr>
                                            <tr>
                                                <td><small>{`batchId: ${pizzaInfo['batchId']}`}</small></td>
                                            </tr>
                                            <tr>
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
    // ***********************************************************
    // ***************** batches in progress *********************
    // ***********************************************************

    const [activeBatchesInfo, setActiveBatchesInfo] = useState<ActiveBatchesInfo>({});
    const [runFetchLoop, setRunFetchLoop] = useGlobalState("runFetchLoop");

    const fetchBatchesInProgress = async () => {
        console.log("fetching batches in progress");
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
        isActiveBatchesInfoEmpty(activeBatchesInfo) ? <div>No batches in progress</div> :
            <div>
                <h4 className="text-center">Station Queues</h4>
                {getTableForInfoObject(activeBatchesInfo, 'queues')}
                <h4 className="text-center">Pizzas in stations</h4>
                {getTableForInfoObject(activeBatchesInfo, 'inStationInfo')}
            </div>
    );
}
