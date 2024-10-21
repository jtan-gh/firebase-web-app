import React, { useEffect, useRef, useState } from "react";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from '@fullcalendar/interaction';
import "./calendar.css";
import "./modal.css";

const dummyEvent = [
  {
    title: "Meeting 1",
    start: "2024-10-21T10:30:00",
    end: "2024-10-21T12:30:00",
    id: "1",
    classNames: ["fc-event-1"],
  },
  {
    title: "Meeting 2",
    start: "2024-10-21T11:30:00",
    end: "2024-10-21T12:00:00",
    id: "2",
    classNames: ["fc-event-2"],
  },
  {
    title: "Meeting 3",
    start: "2024-10-21T13:00:00",
    end: "2024-10-21T14:00:00",
    id: "3",
    classNames: ["fc-event-2"],
  },
];

const checkConflict = (event1, event2) => {
  return event1.start < event2.end && event1.end > event2.start;
};

const highlightConflicts = (events) => {
  const conflictEvents = [];
  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      if (checkConflict(events[i], events[j])) {
        conflictEvents.push(events[i]);
        conflictEvents.push(events[j]);
      }
    }
  }
  return conflictEvents;
};

const removeEvent = (events, event) => {
  for(let i = 0; i< events.length; i++){
    if(events[i].id == event.id){
      events.splice(i,1);
      break;
    }
  }
  console.log(events);
  return [...events];
}

const MonthlyCalendar = () => {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState(dummyEvent);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleEventDrop = (info) => {
    const updatedEvents = events.map(event => {
      if (event.id === info.event.id) {
        return {
          ...event,
          start: info.event.startStr,
          end: info.event.endStr,
        };
      }
      return event;
    });
    setEvents(updatedEvents);
  };

  useEffect(() => {
    const calendar = new Calendar(calendarRef.current, {
      plugins: [dayGridPlugin, interactionPlugin ],
      editable: true,
      initialView: "dayGridMonth",
      events: events,
      eventDrop: handleEventDrop,
      eventDidMount: (info) => {
        const conflictEventIds = new Set(highlightConflicts(events).map((event) => event.id));
        const isConflict = conflictEventIds.has(info.event.id);
        if (isConflict) {
          info.el.style.color = "red";
          info.el.style.border = "2px solid red";
        }

        info.el.addEventListener("click", () => {
          console.log("we can edit these info",info.event.id);
          setSelectedEvent(info.event);
          setModalVisible(true);
        });
      },
      eventContent: (arg) => {
        const startTime = arg.event.start.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const endTime = arg.event.end
          ? arg.event.end.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "";
        return { html: `${startTime} - ${endTime} ${arg.event.title}` };
      },
    });

    calendar.render();

    // Cleanup calendar on unmount
    return () => {
      calendar.destroy();
    };
  }, [events]);

  const handleEdit = () => {
    alert(`Editing event with ID: ${selectedEvent.id}`);
    console.log(events);
    console.log(selectedEvent);
    // TODO Add logic to edit the event
    
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this event?")) {
      console.log(`Editing event with ID: ${selectedEvent.id}`);
      const newEvents = removeEvent(events, selectedEvent);
      setEvents(newEvents);
      setModalVisible(false);
    }
  };

  return (
    <div>
      <div style={{ height: "90vh", width: "90vw" }} ref={calendarRef}></div>

      {modalVisible && (
        <div className="modal-background">
          <div id="modal" className="modal">
            <div className="modal-content">
              <span className="close" onClick={() => setModalVisible(false)}>
                &times;
              </span>
              <h2>{selectedEvent.title}</h2>
              <p>
                Start: {selectedEvent.start.toLocaleString()}
                <br />
                End:{" "}
                {selectedEvent.end ? selectedEvent.end.toLocaleString() : "N/A"}
              </p>
              <button id="editButton" onClick={handleEdit}>
                Edit
              </button>
              <button id="deleteButton" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyCalendar;
