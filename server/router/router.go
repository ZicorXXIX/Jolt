package router

import (
	"time"

	"github.com/ZicorXXIX/Jolt/server/internal/user"
	"github.com/ZicorXXIX/Jolt/server/internal/ws"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

var r *gin.Engine

func InitRouter(userHandler *user.Handler, wsHandler *ws.Handler) {
    r = gin.Default()
    r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST"},
		AllowHeaders:     []string{"Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			return true
		},
		MaxAge: 12 * time.Hour,
	}))
    r.POST("/signup", userHandler.CreateUser)
    r.POST("/login", userHandler.Login)
    r.GET("/logout", userHandler.Logout)

    r.POST("/ws/createRoom", wsHandler.CreateRoom)
    r.GET("/ws/joinRoom/:roomId", wsHandler.JoinRoom)
    r.GET("/ws/getRooms", wsHandler.GetRooms)
    r.GET("/ws/getClients/:roomId", wsHandler.GetClients)
}

func Start(addr string) error {
    return r.Run(addr)
}

