package util

import (
    "fmt"
    "log"

    "golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
    if err != nil {
        fmt.Println("Error Hashing Password")
        log.Fatal(err)
    }
    return string(hashedPassword), nil
}

func CheckPassword(password string, hashedPassword string) error {
    return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
}
