package handlers

import (
	index "TIKify/web/home/templates"

	"github.com/gofiber/fiber/v2"
)

// func ShanonIndex() func(c *fiber.Ctx) (err error) {
// 	return GetHTML(index.Shanon())
// }

func HuffmanIndex() func(c *fiber.Ctx) (err error) {
	return GetHTML(index.Layout("Huffman", "Huffman", ""))
}
