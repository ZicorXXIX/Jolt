package main

import (
	"log"

	"github.com/ZicorXXIX/chat/config"
	"github.com/ZicorXXIX/chat/internal/user"
	"github.com/ZicorXXIX/chat/router"
	"github.com/ZicorXXIX/chat/internal/ws"
)

func main() {
    client, err := config.ConnectDB()
    if err != nil {
        log.Fatalf("Error Connecting... %s", err)
    }

    userRep := user.NewUserRepository(client)
    userSvc := user.NewService(userRep)
    userHandler := user.NewHandler(userSvc)

    hub := ws.NewHub()
    wsHandler := ws.NewHandler(hub)
    go hub.Run()

    router.InitRouter(userHandler, wsHandler)
    router.Start("0.0.0.0:8080")
}

