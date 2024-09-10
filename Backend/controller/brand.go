package controller

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/Martinnezsavemaiwai/config"
	"github.com/Martinnezsavemaiwai/entity"
)

//GET /Brands
func ListBrands(c *gin.Context){
	var brands []entity.Brand

	db := config.DB()

	db.Find(&brands)

	c.JSON(http.StatusOK,&brands)
}
