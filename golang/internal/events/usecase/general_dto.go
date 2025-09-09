package usecase

type SpotDTO struct {
        ID       string `json:"id"`
        Name     string `json:"name"`
        EventID  string `json:"event_id"`
        Reserved bool   `json:"reserved"`
        Status   string `json:"status"`
        TicketID string `json:"ticket_id"`
       Type     string `json:"type"`
       Price    float64 `json:"price"`
}
