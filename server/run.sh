# Step 1: Install Go dependencies
go mod tidy

cd prisma && go run github.com/steebchen/prisma-client-go generate

go build -o main .


./main
