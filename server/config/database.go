package config

import (
    "log"

    "github.com/ZicorXXIX/chat/prisma/db"
)

func ConnectDB() (*db.PrismaClient, error) {
    client := db.NewClient()
    if err := client.Prisma.Connect(); err != nil {
        return nil,err
    }
    log.Println("Connected to Database")

    return client, nil
}
