import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import { useState, useEffect } from "react";
import { COMPLETE_BATCHES_URL, NEST_URL } from "./App.constants";
import BatchForm from "./components/BatchForm";
import { Batch } from "./components/BatchForm";
import ActiveBatches from "./components/ActiveBatches";
import { setGlobalState } from ".";

export default function App() {
  // ***********************************************************
  // ****************** complete batches ***********************
  // ***********************************************************
  const [completeBatches, setCompleteBatches] = useState([]);

  const fetchCompleteBatches = async () => {
    const response = await fetch(COMPLETE_BATCHES_URL);
    const data = await response.json();
    setCompleteBatches(data);
  }

  // useEffect(() => {
  //   fetchCompleteBatches();
  // });

  // ***********************************************************
  // ********************* Add Batches *************************
  // ***********************************************************
  const [showingBatchForm, setShowingBatchForm] = useState(false);

  const handleAddBatch = async (batch: Batch) => {
    setShowingBatchForm(false);
    setGlobalState("runFetchLoop", true);
    
    await fetch(NEST_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(batch)
    })
    
    console.log('batch added');
  }

  // ***********************************************************

  return (
    <BrowserRouter>
      <div className="container">
        <Header onClick={() => setShowingBatchForm(!showingBatchForm)} showingBatchForm={showingBatchForm} />
        <Routes>
          <Route path="/" element={
            <>
              {showingBatchForm && <BatchForm onSubmit={handleAddBatch}/>}
              <ActiveBatches />
            </>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
