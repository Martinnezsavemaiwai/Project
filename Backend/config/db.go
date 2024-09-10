package config

import (
	"fmt"
	"io/ioutil"

	"github.com/Martinnezsavemaiwai/entity"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func ConnectionDB() {
	database, err := gorm.Open(sqlite.Open("ITShop.db?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("failed to connect to database")
	}
	fmt.Println("connected database")
	db = database
}

func SetupDatabase() {

	db.AutoMigrate(
		&entity.Product{},
		&entity.Brand{},
		&entity.Category{},
		&entity.Owner{},
		&entity.Image{},
	)

	hashedPassword, _ := HashPassword("123456")
	owner := &entity.Owner{
		Prefix:    "Mr.",
		FirstName: "Martin",
		LastName:  "Panchiangsri",
		AdminRole: "Owner",
		Email:     "martin@gmail.com",
		Password:  hashedPassword,
	}

	db.FirstOrCreate(owner, &entity.Owner{
		Email: owner.Email,
	})

		// Create Category
		categories := []string{"Notebook", "Monitor", "RAM", "Graphic Card", "CPU", "Mainboard", "Computer", "Keyboard"}
		for _, category := range categories {
			path := fmt.Sprintf("images/category/%s.png", category)
				err := createCategory(category, path, 1)
				if err != nil {
					panic(err)
				}
		}
	
		// Create Brand
		brands := []string{"ASUS", "LENOVO", "T-FORCE", "MSI", "SAMSUNG", "NVIDIA", "INTEL", "STEELSERIES"}
		for _, brand := range brands {
			path := fmt.Sprintf("images/brand/%s.png", brand)
				err := createBrand(brand, path)
				if err != nil {
					panic(err)
				}
		}

	categoryID := uint(1)
	brandID := uint(1)
	Product := entity.Product{
		ProductName:   "NOTEBOOK (โน้ตบุ๊ค) ASUS TUF GAMING F15 FX507ZC4-HN087W",
		Description:   "แบรนด์:ASUS|รหัสสินค้า:SKU-16696",
		PricePerPiece: 28990.00,
		Stock:         10,
		CategoryID:    categoryID,
		BrandID:       brandID,
	}

	db.FirstOrCreate(&Product, &entity.Product{
		ProductName: "NOTEBOOK (โน้ตบุ๊ค) ASUS TUF GAMING F15 FX507ZC4-HN087W",
	})

	// Create Image Product
	for i:=uint(1); i<=7 ;i++{
		dir := fmt.Sprintf("images/product/product%d", i)
		count := countFilesInDir(dir)
		for j:=1 ; j<=count ; j++ {
			filePath := fmt.Sprintf("images/product/product%d/p0%d.jpg", i, j)
			err := createImage(filePath, i)
			if err != nil {
				panic(err)
			}
		}
	}

}


func createCategory(name string, filePath string, id uint) error {
    category := entity.Category{CategoryName: name, ImagePath: filePath, OwnerID: id}

	if err := db.Where("category_name = ?", &category.CategoryName).FirstOrCreate(&category).Error; err != nil {
        return err
    }
    return nil
}

func createBrand(name string, filePath string) error {
    brand := entity.Brand{BrandName: name, ImagePath: filePath}

	if err := db.Where("brand_name = ?", &brand.BrandName).FirstOrCreate(&brand).Error; err != nil {
        return err
    }
    return nil
}

func createImage(filePath string, id uint) error {

    image := entity.Image{FilePath: filePath, ProductID: id}

	if err := db.Where("file_path = ?", &image.FilePath).FirstOrCreate(&image).Error; err != nil {
        return err
    }
    return nil
}


func countFilesInDir(dir string) (int) {
    files, err := ioutil.ReadDir(dir)
    if err != nil {
        return 0
    }

    fileCount := 0
    for _, file := range files {
        if !file.IsDir() {
            fileCount++
        }
    }

    return fileCount
}

