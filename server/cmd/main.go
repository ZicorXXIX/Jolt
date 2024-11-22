package main

import (
    "log"

    "github.com/ZicorXXIX/chat/config"
    "github.com/ZicorXXIX/chat/router"
    "github.com/ZicorXXIX/chat/internal/user"
)

func main() {
    client, err := config.ConnectDB()
    if err != nil {
        log.Fatalf("Error Connecting... %s", err)
    }

    userRep := user.NewUserRepository(client)
    userSvc := user.NewService(userRep)
    userHandler := user.NewHandler(userSvc)

    router.InitRouter(userHandler)
    router.Start("0.0.0.0:8080")
}

