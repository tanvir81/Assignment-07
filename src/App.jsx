import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Banner from "./components/Banner";
import TicketList from "./components/TicketList";
import TaskStatus from "./components/TaskStatus";
import ResolvedList from "./components/ResolvedList";
import Footer from "./components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [allTickets, setAllTickets] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [inProgressIds, setInProgressIds] = useState([]);

  if (!dataLoaded) {
    (async () => {
      const res = await fetch("/data.json");
      const data = await res.json();
      setAllTickets(data);
      setDataLoaded(true);
    })();
  }

  const handleAssign = (id) => {
    if (!inProgressIds.includes(id)) {
      setInProgressIds([...inProgressIds, id]);
    }
  };

  const handleComplete = (id) => {
    const updated = allTickets.map((ticket) =>
      ticket.id === id ? { ...ticket, status: "Resolved" } : ticket
    );
    setAllTickets(updated);
    setInProgressIds(inProgressIds.filter((tid) => tid !== id));
    toast.info(`Ticket #${id} marked as Resolved`);
  };

  const openTickets = allTickets.filter((t) => t.status === "Open");

  const inProgressTickets = allTickets.filter(
    (t) => inProgressIds.includes(t.id) && t.status === "Open"
  );

  const resolvedTickets = allTickets.filter((t) => t.status === "Resolved");
  const handleRemoveResolved = (id) => {
    const updated = allTickets.filter((ticket) => ticket.id !== id);
    setAllTickets(updated);
    toast.warn(`Ticket #${id} removed from Resolved`);
  };
  return (
    <>
      <Navbar />
      <Banner
        inProgressCount={inProgressTickets.length}
        resolvedCount={resolvedTickets.length}
      />
      <main className="max-w-[1440px] mx-auto flex flex-col-reverse md:flex-row gap-4 items-start">
        <TicketList tickets={openTickets} onAssign={handleAssign} />
        <div className="w-full md:w-1/3">
          <TaskStatus
            inProgress={inProgressTickets}
            onComplete={handleComplete}
          />
          <ResolvedList
            resolved={resolvedTickets}
            onRemove={handleRemoveResolved}
          />
        </div>
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
