package user

import (
    "context"
    "log"
    "fmt"

    "github.com/ZicorXXIX/chat/prisma/db"
)


type UserRepository struct {
    Db *db.PrismaClient
}

func (u *UserRepository) Create(ctx context.Context, user *User) (*User, error) {
    result, err := u.Db.User.CreateOne(
            db.User.Email.Set(user.Email),
            db.User.Username.Set(user.Username),
            db.User.Password.Set(user.Password),
        ).Exec(ctx)
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println("Rows affected: ", result)
    return user, nil
}

func (u *UserRepository) GetUserByEmail(ctx context.Context, email string) (*User, error) {
    result, err := u.Db.User.FindUnique(
            db.User.Email.Equals(email),
        ).Exec(ctx)
    if err != nil {
        fmt.Printf("Error Accessing User: %s", err)
    }
    fmt.Println("Found User:", result)

    user := &User{
        ID: result.ID,
        Username: result.Username,
        Email: result.Email,
        Password: result.Password,
    }
    return user, nil
}

func NewUserRepository(Db *db.PrismaClient) Repository {
    return &UserRepository{Db: Db}
}

