package user

import(
    "context"
)

type User struct {
    ID       int    `json:"id"`
    Email    string `json:"email"`
    Username string `json:"username"`
    Password string `json:"password"`
}

type CreateUserReq struct {
    Email    string `json:"email"`
    Username string `json:"username"`
    Password string `json:"password"`
}

type CreateUserRes struct {
    ID       int    `json:"id"`
    Email    string `json:"email"`
    Username string `json:"username"`
}

type LoginUserReq struct {
    Email    string `json:"email"`
    Password string `json:"password"`
}

type LoginUserRes struct {
    accessToken string
    ID       int    `json:"id"`
    Username string `json:"username"`
}

type Repository interface {
    Create(ctx context.Context, user *User) (*User, error)
    GetUserByEmail(ctx context.Context, email string) (*User, error)
}

type Service interface {
    CreateUser(ctx context.Context, req *CreateUserReq) (*CreateUserRes, error)
    Login(ctx context.Context, req *LoginUserReq) (*LoginUserRes, error)
}
