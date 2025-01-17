package user

import (
	"context"
	"fmt"
	"log"
	"strconv"
	"time"

	"github.com/ZicorXXIX/chat/util"
	"github.com/golang-jwt/jwt/v5"
)

const (
    secretKey = "SECRET"
)

type UserService struct {
    Repository
    timeout time.Duration
}

type MyJwtClaims struct {
    ID       string `json:"id"`
    Username string `json:"username"`
    jwt.RegisteredClaims
}

func NewService(repository Repository) Service {
    return &UserService{
        repository,
        time.Duration(2)*time.Second,
    }
}

func (s *UserService) CreateUser(ctx context.Context, req *CreateUserReq) (*CreateUserRes, error) {
    ctx, cancel := context.WithTimeout(ctx, s.timeout)
    defer cancel()

    hashedPassword, err := util.HashPassword(req.Password)
    if err != nil {
        log.Fatal(err)
    }

    u := &User{
        Username: req.Username,
        Email: req.Email,
        Password: hashedPassword,
    }

    r, err := s.Repository.Create(ctx, u)
    if err != nil {
        log.Fatal(err)
    }

    res := &CreateUserRes{
        ID: r.ID,
        Username: r.Username,
        Email: r.Email,
    }

    return res, nil
}

func (s *UserService) Login(ctx context.Context, req *LoginUserReq) (*LoginUserRes, error) {
    ctx, cancel := context.WithTimeout(ctx, s.timeout)
    defer cancel()

    fmt.Println("LoginUserReq: ", req)
    u, err := s.Repository.GetUserByEmail(ctx, req.Email)
    fmt.Print(u)
    if err != nil {
        return &LoginUserRes{}, err
    }
    err = util.CheckPassword(req.Password, u.Password)
    if err != nil {
        return &LoginUserRes{}, err
    }
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, MyJwtClaims{
        ID: strconv.Itoa(u.ID),
        Username: u.Username,
        RegisteredClaims: jwt.RegisteredClaims{
            Issuer: strconv.Itoa(u.ID),
            ExpiresAt: jwt.NewNumericDate(time.Now().Add(24*time.Hour)),
        },
    })

    ss, err := token.SignedString([]byte(secretKey))
    if err != nil {
        return &LoginUserRes{}, err
    }

    return &LoginUserRes{ accessToken: ss, Username: u.Username, ID: u.ID}, nil
}
