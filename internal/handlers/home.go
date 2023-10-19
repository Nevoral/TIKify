package handlers

import (
	index "TIKify/web/home/templates"
	"github.com/gofiber/fiber/v2"
)

func HomeIndex() func(c *fiber.Ctx) (err error) {
	return GetHTML(index.Layout("TIKify", "Home", ""))
}
