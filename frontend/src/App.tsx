import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import { useState } from "react";
import { BATCH_SUBMITTING_URL } from "./App.constants";
import BatchForm from "./components/BatchForm";
import { Batch } from "./components/BatchForm";
import ActiveBatches from "./components/ActiveBatches";
import { setGlobalState } from ".";
import CompletedBatches from "./components/CompletedBatches";
import Footer from "./components/Footer";

export default function App() {
  const [showingBatchForm, setShowingBatchForm] = useState(false);

  const handleAddBatch = async (batch: Batch) => {
    setShowingBatchForm(false);
    setGlobalState("runFetchLoop", true);

    await fetch(BATCH_SUBMITTING_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(batch)
    })

    console.log('batch added');
  }

  return (
    <BrowserRouter>
      <div className="container">
        <Header onClick={() => setShowingBatchForm(!showingBatchForm)} showingBatchForm={showingBatchForm} />
        <Routes>
          <Route path="/" element={
            <>
              {showingBatchForm && <BatchForm onSubmit={handleAddBatch} />}
              <ActiveBatches />
            </>
          } />
          <Route path="/completed" element={<CompletedBatches />} />
        </Routes>
        <Footer />
      </div>
      <p style={{textAlign:"center"}}>Made by <a href="https://github.com/Elfein7Night">E. Fine</a></p>
    </BrowserRouter>
  );
}
