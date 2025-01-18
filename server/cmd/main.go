package main

import (
	"log"

	"github.com/ZicorXXIX/Jolt/server/config"
	"github.com/ZicorXXIX/Jolt/server/internal/user"
	"github.com/ZicorXXIX/Jolt/server/internal/ws"
	"github.com/ZicorXXIX/Jolt/server/router"
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

