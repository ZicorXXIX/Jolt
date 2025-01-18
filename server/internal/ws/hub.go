package ws

import "sync"

type Room struct {
    ID      string            `json:"id"`
    Name    string            `json:"name"`
    Clients map[string]*Client `json:"clients"`
}

type Hub struct {
    Rooms      map[string]*Room
    Register   chan *Client
    Unregister chan *Client
    Broadcast  chan *Message
    mu         sync.Mutex // Mutex to avoid race conditions
}

func NewHub() *Hub {
    return &Hub{
        Rooms:      make(map[string]*Room),
        Register:   make(chan *Client),
        Unregister: make(chan *Client),
        Broadcast:  make(chan *Message),
    }
}

func (h *Hub) Run() {
    for {
        select {
        case cl := <-h.Register:
            h.mu.Lock()
            if _, ok := h.Rooms[cl.RoomID]; ok {
                r := h.Rooms[cl.RoomID]
                if _, ok := r.Clients[cl.ID]; !ok {
                    r.Clients[cl.ID] = cl // Fixed key issue
                }
            }
            h.mu.Unlock()

        case cl := <-h.Unregister:
            h.mu.Lock()
            if _, ok := h.Rooms[cl.RoomID]; ok {
                r := h.Rooms[cl.RoomID]
                if _, ok := r.Clients[cl.ID]; ok {
                    // Broadcast client left message
                    h.Broadcast <- &Message{
                        Content:  "User left the Jolt/server",
                        RoomID:   cl.RoomID,
                        Username: cl.Username,
                    }
                    delete(r.Clients, cl.ID)
                    defer close(cl.Message) // Prevent panic
                }
            }
            h.mu.Unlock()

        case m := <-h.Broadcast:
            h.mu.Lock()
            if _, ok := h.Rooms[m.RoomID]; ok {
                for _, cl := range h.Rooms[m.RoomID].Clients {
                    cl.Message <- m
                }
            }
            h.mu.Unlock()
        }
    }
}
