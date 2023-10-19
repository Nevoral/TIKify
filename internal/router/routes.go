package router

import (
	"TIKify/internal/handlers"
	"github.com/gofiber/fiber/v2"
)

func Router(app *fiber.App) {
	app.Route("/enigma", func(api fiber.Router) {
		api.Get("/js/:file", handlers.GetJs())
		api.Get("/assets/:file", handlers.GetAsset())
		api.Get("/", handlers.EnigmaHtml())
	}, "enigma")

	app.Route("/grafolog", func(api fiber.Router) {
		api.Get("/js/:file", handlers.GetJs())
		api.Get("/assets/:file", handlers.GetAsset())
		api.Get("/", handlers.EmptyGraph())
		api.Get("/graphConfig", handlers.GraphConfigIndex())
		api.Post("/graphConfig", handlers.GraphPostIndex())
	}, "grafolog")

	app.Route("/", func(api fiber.Router) {
		api.Get("/js/:file", handlers.GetJs())
		api.Get("/assets/:file", handlers.GetAsset())
		api.Get("/", handlers.HomeIndex())
		api.Get("/home", handlers.HomeIndex())
		api.Get("/login", handlers.LogInIndex())
	}, "home")

}
