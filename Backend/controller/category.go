package controller

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/Martinnezsavemaiwai/config"
	"github.com/Martinnezsavemaiwai/entity"
)

//GET /categories
func ListCategories(c *gin.Context){
	var categories []entity.Category

	db := config.DB()

	db.Preload("Owner").Find(&categories)

	c.JSON(http.StatusOK,&categories)
}