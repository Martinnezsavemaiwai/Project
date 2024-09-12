package controller

import (
	"net/http"

	"github.com/Martinnezsavemaiwai/config"
	"github.com/Martinnezsavemaiwai/entity"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	services "github.com/Martinnezsavemaiwai/service"
)

type Authen struct{
	Email		string
	Password	string
}

// 

// POST /signin
func SignInOwner(c *gin.Context) {

	var payload Authen

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	var owner entity.Owner
	db.First(&owner, "email=?", payload.Email)
	if owner.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "owner not found"})
		return
	}

	err := bcrypt.CompareHashAndPassword([]byte(owner.Password), []byte(payload.Password))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "password is incerrect"})
		return
	}

	jwtWrapper := services.JwtWrapper{
		SecretKey: "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
		Issuer: "AuthService",
		ExpirationHours: 24,
	}

	signedToken, err := jwtWrapper.GenerateToken(owner.Email)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "error signing token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token_type": "Bearer", "token": signedToken, "id": owner.ID})
}