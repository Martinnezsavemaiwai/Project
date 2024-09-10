package controller

import (
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/Martinnezsavemaiwai/config"
	"github.com/Martinnezsavemaiwai/entity"
	"github.com/gin-gonic/gin"
)

func ListImages(c *gin.Context) {
	var images []entity.Image

	db := config.DB()
	if err := db.Find(&images).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, images)
}





// GET /images/:productId
func GetImageByProductByID(c *gin.Context){
	productID := c.Param("productId")
	var image []entity.Image

	db := config.DB()
	results := db.Preload("Product.Category.Owner").Preload("Product.Brand").Find(&image, "product_id=?", productID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, image)
}

// POST /image/:productId
func CreateImage(c *gin.Context){
	productID, err := strconv.ParseUint(c.Param("productId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	db := config.DB()

	form, err := c.MultipartForm()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file is received"})
		return
	}

	files := form.File["image"]

	for _, file := range files{
		subfolder := "product"+strconv.Itoa(int(productID))
		fileName := filepath.Base(file.Filename)
		filePath := filepath.Join("images", "product", subfolder, fileName)	

		// สร้างตำแหน่งโฟลเดอร์ที่จะเก็บถ้ายังไม่มี
		err = os.MkdirAll(filepath.Join("images", "product", subfolder), os.ModePerm)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create directory"})
			return
		}

		if err := c.SaveUploadedFile(file, filePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
			return
		}

		var product entity.Product
		if err := db.First(&product, productID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
			return
		}

		image := entity.Image{
			FilePath:  filePath,
			ProductID: uint(productID),
			Product:   product,
		}
		if err := db.Create(&image).Error; 
		err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Files uploaded successfully"})
}

// PATCH /image/:imageId
func UpdateImage(c *gin.Context) {
	// แปลง imageID จาก string เป็น uint
	imageID, err := strconv.ParseUint(c.Param("imageId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid image ID"})
		return
	}

	db := config.DB()

	// ค้นหา image ที่เกี่ยวข้องกับ imageID
	var image entity.Image
	if err := db.First(&image, imageID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Image not found"})
		return
	}

	// รับไฟล์ใหม่จาก request (ไม่บังคับว่าต้องมี)
	file, err := c.FormFile("image")
	if err == nil {
		// ถ้ามีการอัปโหลดไฟล์ใหม่
		// ลบไฟล์เก่าที่เก็บไว้
		if err := os.Remove(image.FilePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete old image"})
			return
		}

		// สร้าง path ใหม่สำหรับไฟล์ใหม่
		subfolder := "product" + strconv.Itoa(int(image.ProductID))
		fileName := filepath.Base(file.Filename)
		filePath := filepath.Join("images", "product", subfolder, fileName)

		// สร้างตำแหน่งโฟลเดอร์ถ้ายังไม่มี
		if err := os.MkdirAll(filepath.Join("images", "product", subfolder), os.ModePerm); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create directory"})
			return
		}

		// บันทึกไฟล์ใหม่
		if err := c.SaveUploadedFile(file, filePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save new image"})
			return
		}

		// อัปเดต FilePath ในฐานข้อมูล
		image.FilePath = filePath
	}

	// ตรวจสอบฟิลด์อื่นๆ ที่ต้องการอัปเดตจาก request body (ถ้ามี)
	productID, _ := strconv.ParseUint(c.PostForm("product_id"), 10, 64)
	if productID != 0 {
		var product entity.Product
		if err := db.First(&product, productID).Error; err == nil {
			image.ProductID = uint(productID)
			image.Product = product
		}
	}

	// บันทึกการอัปเดตกลับไปยังฐานข้อมูล
	if err := db.Save(&image).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update image"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Image updated successfully", "image": image})
}
