package main

import (
	"net/http"

	"github.com/Martinnezsavemaiwai/config"
	"github.com/Martinnezsavemaiwai/controller"
	"github.com/gin-gonic/gin"
)

const PORT = "8000"

func main() {
	config.ConnectionDB()
	config.SetupDatabase()

	r := gin.Default()

	r.Use(CORSMiddleware())

	r.POST("/signin", controller.SignInOwner)


	r.Static("/images", "./images")

	router := r.Group("")
	{
		// Product Routes
		router.GET("/products", controller.ListProducts)
		router.GET("/products/:id", controller.GetProductByID)
		router.POST("/products", controller.CreateProduct)
		router.PATCH("/products/:id", controller.UpdateProduct)
		router.DELETE("/products/:id", controller.DeleteProduct)
		// router.GET("/products", controller.GetFilteredProducts)

		// Brand Routes
		router.GET("/brands", controller.ListBrands)

		// Category Routes
		router.GET("/categories", controller.ListCategories)

		// Owner Routes
		router.GET("/owners", controller.ListOwner)
		router.GET("/owner/:id", controller.GetOwnerByID)

		// Image Routes
		router.GET("/product-images", controller.ListImages)
		router.GET("/product-images/:productId", controller.GetImageByProductByID)
		router.POST("/product-image/:productId", controller.CreateImage)
		router.PUT("/product-image/:productId", controller.UpdateImage)
	}

	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)
	})

	// Run the server
	r.Run("localhost:" + PORT)
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
