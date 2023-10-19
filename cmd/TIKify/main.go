package main

import (
	"TIKify/internal/router"
	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()

	router.Router(app)

	err := app.Listen(":42069")
	if err != nil {
		return
	}
}
