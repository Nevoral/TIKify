package handlers

import (
	enigma "TIKify/web/enigma/templates"
	"github.com/gofiber/fiber/v2"
)

func EnigmaHtml() func(c *fiber.Ctx) (err error) {
	return GetHTML(enigma.Enigma())
}
