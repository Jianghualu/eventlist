const API = (() => {
    const URL = "http://localhost:3000/events";

    const getEvents = () => {
      return fetch(URL).then((res) => res.json());
    };
  
    const postEvent = (newEvent) => {
      return fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      }).then((res) => res.json());
    };

    const putEvent = (id, inputName) => {
      return fetch(`${URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          {"eventName": inputName,
          "startDate": id.eventStartDate,
          "endDate": id.endDate})
        // body:JSON.stringify({"sadfasdfasdfas": "sadfasdfasfdsf"})
      }).then((res) => res.json());
    };

    const patchEvent = (id) => {
      return fetch(`${URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
    };

    const deleteEvent = (id) => {
      return fetch(`${URL}/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .catch(console.log);
    };
  
    return {
      getEvents,
      postEvent,
      putEvent,
      patchEvent,
      deleteEvent,
    };
  })();


class EventModel{
  #events;
    constructor(){
        this.events = [];
    }

//Events method：

    fetchEvents(){
      
      return API.getEvents().then(events=>{
        this.setEvents(events);
        return events;
      })
    }
    setEvents(events) {
      this.#events = events;
    }
  
    getEvents() {
      return this.#events;
    }
  
//event method： 
    addEvent(newEvent) {
      return API.postEvent(newEvent).then((addedEvent) => {
        this.#events.push(addedEvent);
        return addedEvent;
      });
    }
  
    removeEvent(id) {
      return API.deleteEvent(id).then((removedEvent) => {
        this.#events = this.#events.filter((event) => event.id !== +id);
        return removedEvent;
      });
    }

    updateEvent(id, updateText){
      return API.putEvent(id).then((updatedEvent) => {
        this.#events = this.#events.filter((event) => event.id !== +id);
        return updatedEvent;
      });
    }

}

class EventView{
    constructor(){
        this.eventAdd = document.querySelector(".event-list__add-btn");
        this.eventList = document.querySelector(".events-list");
        this.eventTitle = document.querySelector(".event__name");
        
        // console.log(this.eventTitle);
        this.eventStartDate = document.querySelector(".event__start-date");
        this.eventEndDate  = document.querySelector(".event__end-date");
        // console.log(this.eventName);
        // this.eventAdd.addEventListener("click", (e) => {
        //   // e.preventDefault();
        // });
    }

    formatEvent(event) {
      return `<tr class="event" id="${event.id}">
                <td><input type="text" class="event__name"/>${event.eventName}</td>
                <td><input type="date" class="event__start-date"/>${event.startDate}</td>
                <td><input type="date" class="event__end-date"/>${event.endDate}</td>
                <td>
                  <div class="event__action">
                    <button class="event_btn-edit">Edit</button> 
                    <button class="event_btn-delete">DELETE</button>
                  </div>
                </td>
              </tr>`;
    }

    renderEvents(events) {
      
      const eventsInnerHTML = events
        .map((event) => {
          return this.formatEvent(event);
        })
        .join("");
      this.eventList.innerHTML = eventsInnerHTML;
    }

    removeEvent(domID){
      const element = document.getElementById(domID);
      element.remove()
    }

}

class EventController{
  constructor(view, model){
      this.view = view;
      this.model = model;
      this.initialize();
  }

  initialize() {
      this.setUpEvents();
      this.model.fetchEvents().then(events=>{
        this.view.renderEvents(events);
      })
      
  }

  setUpEvents() {
    this.setUpTableEvent();
    this.setUpActionEvent();
  }

  setUpTableEvent(){
    this.view.eventAdd.addEventListener("click", (e) => {
      // e.preventDefault();
      // console.log(this.view.eventTitle)
      const inputName = this.view.eventTitle.value;
      const inputStartDate = this.view.eventStartDate.value;
      const inputEndDate = this.view.eventEndDate.value;
      this.model
        .addEvent({
          eventName: inputName,
          startDate: inputStartDate,
          endDate: inputEndDate,
        })
        .then((data) => {
          this.view.renderEvents(this.model.getEvents());
        });
    });
  }

    setUpActionEvent() {
      this.view.eventList.addEventListener("click", (e) => {
        if (e.target.classList.contains("event_btn-delete")) {
          const domID = e.target.parentNode.parentNode.parentNode.getAttribute("id");
        //   console.log(domID);
        //   const id = domID.substring(4);
          this.model.removeEvent(domID).then((data) => {
            // console.log(this.model.getTodos());
            this.view.removeEvent(domID)
          });
        }
  
        if(e.target.classList.contains("event_btn-edit")){
          const domID = e.target.parentNode.parentNode.parentNode.getAttribute("id");
          console.log(domID);
          const inputName = this.view.eventTitle.value;
          
          const inputStartDate = this.view.eventStartDate.value;
          const inputEndDate = this.view.eventEndDate.value;

            this.model.updateEvent(domID, inputName).then((data) => {
              console.log('sadfadsf');
              // this.view.renderEvents(this.model.getEvents());
            });
        }
      });
    }

  
}

const eventView = new EventView();
const eventModel = new EventModel();
const eventController = new EventController(eventView, eventModel);
